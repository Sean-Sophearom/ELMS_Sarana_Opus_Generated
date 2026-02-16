<?php

namespace App\Ai\Agents;

use App\Models\User;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(Lab::Gemini->value)]
#[Temperature(0.7)]
#[MaxTokens(2048)]
class ChatbotAgent implements Agent, Conversational
{
    use Promptable, RemembersConversations;
    
    /**
     * Additional generation configuration to disable thinking.
     */
    protected array $generationConfig = [
        'thinkingConfig' => [
            'thinkingMode' => 'NONE',
        ],
    ];

    public function __construct(
        public ?User $user = null,
        public ?string $context = null
    ) {}

    /**
     * Runtime override for the model
     */
    public function model(): string
    {
        return config('ai.providers.gemini.model');
    }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        $baseInstructions = <<<'INSTRUCTIONS'
You are a helpful AI assistant for a Leave Management System. You assist users with:
- Understanding leave policies and procedures
- Answering questions about leave balances and requests
- Explaining leave types and their usage
- Providing general assistance with the system

Be friendly, professional, and concise in your responses.
Keep answers focused and relevant to leave management.
INSTRUCTIONS;

        if ($this->context) {
            return $baseInstructions . "\n\nAdditional context: " . $this->context;
        }

        return $baseInstructions;
    }

    /**
     * Set additional context for the agent.
     */
    public function withContext(string $context): self
    {
        $this->context = $context;
        
        return $this;
    }

    /**
     * Get a descriptive name for this agent.
     */
    public function name(): string
    {
        return 'Leave Management Chatbot';
    }
    
    /**
     * Get additional provider-specific options.
     */
    public function providerOptions(): array
    {
        return [
            'generationConfig' => [
                'thinkingConfig' => [
                    'thinkingMode' => 'NONE',
                ],
            ],
        ];
    }
}
