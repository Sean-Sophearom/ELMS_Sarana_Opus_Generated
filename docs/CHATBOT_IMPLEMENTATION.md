# AI Chatbot Configuration & Future RAG Implementation Guide

## Current Implementation

### Components
1. **Agent Class**: `app/Ai/Agents/ChatbotAgent.php`
   - Uses Google Gemini 2.0 Flash Exp model
   - Implements conversation memory using `RemembersConversations` trait
   - Configurable model and parameters via attributes
   - Context-aware responses

2. **Controller**: `app/Http/Controllers/ChatbotController.php`
   - Rate limiting: 20 requests per minute per user
   - Conversation persistence via conversation_id
   - Error handling and user context injection
   - Prepared for RAG implementation via `getUserContext()` method

3. **Frontend**: `resources/js/Components/Chatbot.tsx`
   - Floating chatbot button on all authenticated pages
   - Real-time messaging interface
   - Conversation history
   - Error handling

4. **Routes**: `routes/web.php`
   - POST /chatbot/message - Send messages
   - POST /chatbot/stream - Stream responses (SSE)
   - GET /chatbot/conversations - Get conversation history
   - POST /chatbot/clear-rate-limit - Admin function

### Configuration

#### Environment Variables (.env)
```bash
# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-3-flash-preview # Configurable model
```

#### Get Your API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Create a new API key
3. Add it to your .env file

#### Rate Limiting
- Default: 20 requests per minute per user
- Can be adjusted in `ChatbotController::sendMessage()`
- Admin can clear rate limits via API

---

## Future RAG (Retrieval-Augmented Generation) Implementation

### Overview
RAG enhances the chatbot by retrieving relevant documents/context before generating responses, making it more accurate and informed.

### Implementation Steps

#### 1. Setup Vector Database (PostgreSQL with pgvector)

```bash
# Install pgvector extension
php artisan migrate

# In migration:
Schema::create('knowledge_base', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->vector('embedding', dimensions: 768); // or 1536 for OpenAI embeddings
    $table->string('category')->nullable();
    $table->json('metadata')->nullable();
    $table->timestamps();
    
    $table->index(['category']);
});

# Add vector index for similarity search
Schema::table('knowledge_base', function (Blueprint $table) {
    $table->vector('embedding', dimensions: 768)->index();
});
```

#### 2. Create Knowledge Base Model

```php
// app/Models/KnowledgeBase.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KnowledgeBase extends Model
{
    protected $table = 'knowledge_base';
    
    protected $fillable = [
        'title',
        'content',
        'embedding',
        'category',
        'metadata',
    ];
    
    protected function casts(): array
    {
        return [
            'embedding' => 'array',
            'metadata' => 'array',
        ];
    }
}
```

#### 3. Generate Embeddings for Documents

```php
// app/Console/Commands/GenerateEmbeddings.php
use Laravel\Ai\Embeddings;
use App\Models\KnowledgeBase;

// For each document:
$embeddings = Embeddings::for([$document->content])
    ->dimensions(768) // or 1536
    ->generate();

KnowledgeBase::create([
    'title' => $document->title,
    'content' => $document->content,
    'embedding' => $embeddings->embeddings[0],
    'category' => 'leave_policy',
    'metadata' => ['source' => 'hr_manual'],
]);
```

#### 4. Implement Similarity Search Tool

```php
// app/Ai/Tools/LeaveKnowledgeSearch.php
namespace App\Ai\Tools;

use App\Models\KnowledgeBase;
use Laravel\Ai\Tools\SimilaritySearch;

class LeaveKnowledgeSearch
{
    public static function search(string $query): array
    {
        $documents = KnowledgeBase::query()
            ->whereVectorSimilarTo('embedding', $query, minSimilarity: 0.7)
            ->limit(5)
            ->get();
        
        return $documents->map(function ($doc) {
            return [
                'title' => $doc->title,
                'content' => $doc->content,
                'relevance' => $doc->similarity_score,
            ];
        })->toArray();
    }
}
```

#### 5. Update ChatbotAgent with RAG

```php
// app/Ai/Agents/ChatbotAgent.php
use App\Ai\Tools\LeaveKnowledgeSearch;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Tools\SimilaritySearch;

class ChatbotAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;
    
    /**
     * Get the tools available to the agent.
     */
    public function tools(): iterable
    {
        return [
            SimilaritySearch::usingModel(
                model: KnowledgeBase::class,
                column: 'embedding',
                minSimilarity: 0.7,
                limit: 5,
                query: fn($query) => $query->where('category', 'leave_policy')
            )->withDescription('Search the leave management knowledge base for relevant policies and procedures.'),
        ];
    }
}
```

#### 6. Enhanced Context Injection

```php
// In ChatbotController::getUserContext()
private function getUserContext($user): ?string
{
    $context = [];
    
    // User info
    $context[] = "User role: {$user->role->value}";
    
    if ($user->department) {
        $context[] = "Department: {$user->department->name}";
    }
    
    // RAG: Add relevant leave balances
    $leaveBalances = $user->leaveBalances()
        ->with('leaveType')
        ->get()
        ->map(fn($balance) => 
            "{$balance->leaveType->name}: {$balance->available_days} days available"
        )
        ->join(', ');
    
    if ($leaveBalances) {
        $context[] = "Leave balances: {$leaveBalances}";
    }
    
    // RAG: Add recent leave requests context
    $recentRequests = $user->leaveRequests()
        ->latest()
        ->limit(3)
        ->get()
        ->map(fn($request) => 
            "{$request->leaveType->name} from {$request->start_date} to {$request->end_date} ({$request->status})"
        )
        ->join('; ');
    
    if ($recentRequests) {
        $context[] = "Recent leave requests: {$recentRequests}";
    }
    
    return !empty($context) ? implode('. ', $context) : null;
}
```

### RAG Content Sources

#### Recommended Documents to Vectorize:
1. **Leave Policies**
   - Annual leave policy
   - Sick leave policy
   - Emergency leave policy
   - Maternity/Paternity leave
   - Unpaid leave rules

2. **HR Procedures**
   - How to submit leave requests
   - Approval workflows
   - Leave balance calculations
   - Holiday calendar

3. **FAQs**
   - Common questions about leave types
   - Leave carry-over policies
   - Emergency contact procedures

4. **Company Policies**
   - Department-specific rules
   - Probation period restrictions
   - Notice period requirements

### Testing RAG Implementation

```php
// tests/Feature/ChatbotRagTest.php
public function test_chatbot_retrieves_relevant_leave_policy()
{
    $this->seed(KnowledgeBaseSeeder::class);
    
    $response = $this->actingAs($user)
        ->postJson('/chatbot/message', [
            'message' => 'How many sick leave days do I have?',
        ]);
    
    $response->assertOk();
    // Assert that response includes relevant policy information
}
```

### Performance Optimization

1. **Cache Embeddings**
   - Enable caching in config/ai.php
   - Set appropriate TTL for embeddings

2. **Index Optimization**
   - Use HNSW indexes for fast similarity search
   - Adjust ef_search parameter based on accuracy needs

3. **Chunking Strategy**
   - Break large documents into manageable chunks (500-1000 tokens)
   - Maintain context overlap between chunks

4. **Query Optimization**
   - Pre-filter by category before similarity search
   - Use metadata for quick filtering

### Monitoring & Analytics

```php
// Track RAG effectiveness
Log::info('RAG retrieval', [
    'query' => $query,
    'documents_found' => count($results),
    'avg_similarity' => $avgSimilarity,
    'user_id' => $user->id,
]);
```

---

## Advanced Features (Future)

### 1. Multi-Modal Support
- Attach policy PDFs, images
- Use Gemini's vision capabilities
- Process scanned documents

### 2. Conversation Analytics
- Track common questions
- Identify policy gaps
- Measure chatbot effectiveness

### 3. Proactive Suggestions
- Remind users of upcoming leaves
- Suggest optimal leave dates
- Alert about expiring leave balances

### 4. Integration with Email
- Send leave summaries via email
- Email notifications for approvals
- Weekly digest of leave status

### 5. Voice Interface
- Use Laravel AI SDK Audio for TTS
- Voice commands for leave requests
- Accessibility improvements

---

## Security Considerations

1. **Rate Limiting**: Already implemented (20 requests/minute)
2. **Authentication**: All routes protected by auth middleware
3. **Authorization**: Check user permissions before sensitive operations
4. **Data Privacy**: Don't expose other users' data
5. **API Key Security**: Keep GEMINI_API_KEY secret, use environment variables
6. **Input Validation**: Validate and sanitize all user inputs
7. **Audit Logging**: Log all chatbot interactions for compliance

---

## Troubleshooting

### Common Issues

1. **"Rate limit exceeded"**
   - Wait 60 seconds or contact admin to clear limit
   - Adjust rate limit in controller if needed

2. **"Error generating response"**
   - Check GEMINI_API_KEY is valid
   - Verify API quota on Google AI Studio
   - Check Laravel logs for details

3. **Slow responses**
   - Consider using streaming endpoint
   - Optimize context injection
   - Reduce embedding dimensions

4. **Irrelevant responses**
   - Improve knowledge base content
   - Adjust similarity threshold
   - Enhance user context injection

---

## Resources

- Laravel AI SDK: https://laravel.com/docs/12.x/ai-sdk
- Google Gemini API: https://ai.google.dev/docs
- pgvector Documentation: https://github.com/pgvector/pgvector
- RAG Best Practices: https://www.pinecone.io/learn/retrieval-augmented-generation/
