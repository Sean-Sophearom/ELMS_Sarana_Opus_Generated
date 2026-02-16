<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ChatbotAgent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ChatbotController extends Controller
{
    /**
     * Send a message to the chatbot.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'conversation_id' => 'nullable|string',
        ]);

        // Rate limiting: 20 requests per minute per user
        $key = 'chatbot:' . $request->user()->id;

        if (RateLimiter::tooManyAttempts($key, 20)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'message' => ["Too many requests. Please try again in {$seconds} seconds."],
            ]);
        }

        RateLimiter::hit($key, 60);

        try {
            $agent = new ChatbotAgent($request->user());

            // Add user context (can be extended with RAG data later)
            $userContext = $this->getUserContext($request->user());
            if ($userContext) {
                $agent->withContext($userContext);
            }

            // Check if continuing existing conversation
            if ($request->conversation_id) {
                $response = $agent
                    ->continue($request->conversation_id, as: $request->user())
                    ->prompt($request->message);
            } else {
                // Start new conversation
                $response = $agent
                    ->forUser($request->user())
                    ->prompt($request->message);
            }

            return response()->json([
                'success' => true,
                'message' => (string) $response,
                'conversation_id' => $response->conversationId,
                'usage' => [
                    'prompt_tokens' => $response->usage?->promptTokens,
                    'completion_tokens' => $response->usage?->completionTokens,
                    // 'total_tokens' => $response->usage?->totalTokens,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'An error occurred while processing your message. Please try again.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Stream a message to the chatbot (for real-time responses).
     */
    public function streamMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'conversation_id' => 'nullable|string',
        ]);

        // Rate limiting
        $key = 'chatbot:' . $request->user()->id;
        if (RateLimiter::tooManyAttempts($key, 20)) {
            return response()->json(['error' => 'Too many requests.'], 429);
        }
        RateLimiter::hit($key, 60);
        return (new ChatbotAgent($request->user()))
            ->withContext($this->getUserContext($request->user()))
            ->stream($request->message);
    }

    /**
     * Get user-specific context for RAG (Retrieval-Augmented Generation).
     * This can be extended later to include relevant documents, policies, etc.
     */
    private function getUserContext($user): ?string
    {
        $context = [];

        // Add user role
        $context[] = "User role: {$user->role->value}";

        // Add department if available
        if ($user->department) {
            $context[] = "Department: {$user->department->name}";
        }

        // Future: Add relevant leave balances, policies, FAQs, etc.
        // This is where RAG implementation can be added:
        // - Query vector database for relevant documents
        // - Include specific leave policies based on user's department
        // - Add recent leave requests context

        return !empty($context) ? implode('. ', $context) : null;
    }

    /**
     * Get conversation history for a user.
     */
    public function getConversations(Request $request)
    {
        // This would query the agent_conversations table
        // For now, return empty array as conversations are managed by the agent
        return response()->json([
            'conversations' => [],
        ]);
    }

    /**
     * Clear rate limit for a user (admin function).
     */
    public function clearRateLimit(Request $request)
    {
        // $this->authorize('manage-system');

        $userId = $request->input('user_id', $request->user()->id);
        $key = 'chatbot:' . $userId;

        RateLimiter::clear($key);

        return response()->json([
            'success' => true,
            'message' => 'Rate limit cleared successfully.',
        ]);
    }
}
