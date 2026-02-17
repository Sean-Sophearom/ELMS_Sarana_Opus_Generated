import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import Modal from './Modal';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatbotProps {
    className?: string;
}

export default function Chatbot({ className = '' }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const page = usePage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

        // Create a placeholder for the assistant's streaming message
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Retry logic with exponential backoff
        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(route('chatbot.stream'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                        'X-CSRF-TOKEN': page.props.csrf_token as string || '',
                    },
                    body: JSON.stringify({
                        message: currentInput,
                        conversation_id: conversationId,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    const errorMessage = errorData?.error || errorData?.message || response.statusText;
                    
                    if (response.status === 429) {
                        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
                    } else if (response.status === 419) {
                        throw new Error('Session expired. Please refresh the page and try again.');
                    } else if (response.status === 500) {
                        throw new Error(`Server error: ${errorMessage}. Retrying... (${attempt}/${maxRetries})`);
                    } else {
                        throw new Error(`Request failed: ${errorMessage}`);
                    }
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let streamedContent = '';

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6).trim();
                                
                                if (data === '[DONE]') {
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    
                                    // Handle text_delta events which contain the actual content
                                    if (parsed.type === 'text_delta' && parsed.delta) {
                                        streamedContent += parsed.delta;
                                        
                                        // Update the assistant message with streamed content
                                        setMessages((prev) =>
                                            prev.map((msg) =>
                                                msg.id === assistantMessageId
                                                    ? { ...msg, content: streamedContent }
                                                    : msg
                                            )
                                        );
                                    }
                                    // Handle stream_end to potentially save conversation_id
                                    // Note: Laravel AI SDK stores conversation automatically
                                } catch (e) {
                                    // Ignore parsing errors for non-JSON lines
                                }
                            }
                        }
                    }
                }

                // Success - break out of retry loop
                setIsLoading(false);
                return;

            } catch (err) {
                lastError = err instanceof Error ? err : new Error('An unknown error occurred');
                console.error(`Chatbot error (attempt ${attempt}/${maxRetries}):`, err);

                // If it's not a retryable error, break immediately
                if (lastError.message.includes('Rate limit') || 
                    lastError.message.includes('Session expired') ||
                    attempt === maxRetries) {
                    break;
                }

                // Wait before retrying (exponential backoff: 1s, 2s, 4s)
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
                }
            }
        }

        // If we get here, all retries failed
        if (lastError) {
            const helpfulMessage = lastError.message.includes('Rate limit')
                ? lastError.message
                : lastError.message.includes('Session expired')
                ? lastError.message
                : lastError.message.includes('Network')
                ? 'Network error. Please check your internet connection and try again.'
                : `Unable to connect to AI assistant after ${maxRetries} attempts. ${lastError.message}\n\nPlease try again or contact support if the issue persists.`;
            
            setError(helpfulMessage);
            
            // Remove the empty assistant message on error
            setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
        } 

        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearConversation = () => {
        setMessages([]);
        setConversationId(null);
        setError(null);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <>
            {/* Floating Chatbot Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 rounded-full bg-indigo-600 p-4 text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
                aria-label="Open chatbot"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                </svg>
                {messages.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                        {messages.filter((m) => m.role === 'assistant').length}
                    </span>
                )}
            </button>

            {/* Chatbot Modal */}
            <Modal show={isOpen} onClose={() => setIsOpen(false)} maxWidth="2xl">
                <div className="flex h-[600px] flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">AI Assistant</h2>
                                <p className="text-xs text-white/80">Powered by Google Gemini</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 items-stretch">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearConversation}
                                    className="rounded-lg bg-white/20 px-3 py-1 text-sm hover:bg-white/30 focus:outline-none"
                                    title="Clear conversation"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg bg-white/20 p-2 hover:bg-white/30 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="mb-4 rounded-full bg-indigo-100 p-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-12 w-12 text-indigo-600"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Welcome to AI Assistant!</h3>
                                <p className="mt-2 max-w-sm text-sm text-gray-600">
                                    Ask me anything about leave management, policies, or how to use the system.
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                                message.role === 'user'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                            <p
                                                className={`mt-1 text-xs ${
                                                    message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] rounded-lg bg-white px-4 py-2 shadow-sm border border-gray-200">
                                            <div className="flex space-x-2">
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="border-t border-red-200 bg-red-50 px-4 py-2">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t bg-white p-4">
                        <div className="flex space-x-2 items-center">
                            <TextareaAutosize
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message... (Press Enter to send)"
                                className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                minRows={1}
                                maxRows={4}
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Rate limited to 20 messages per minute
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
}
