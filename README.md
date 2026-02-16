# Leave Management System

A leave management application built with Laravel 12, React 18, Inertia.js, and Tailwind CSS.

## Tech Stack

- **Backend:** PHP 8.4+, Laravel 12
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Bridge:** Inertia.js 2.0
- **Build:** Vite 7
- **Auth:** Laravel Breeze
- **Routing:** Ziggy (Laravel routes in JS)
- **AI:** Laravel AI SDK with Google Gemini

## Requirements

- PHP 8.4+
- Composer
- Node.js 18+
- npm or yarn
- SQLite / MySQL / PostgreSQL

## Quick Start

### 1. Clone and Install

```bash
# Install all dependencies and set up the project
composer setup
```

The `composer setup` script will:
- Install PHP dependencies
- Copy `.env.example` to `.env`
- Generate application key
- Run database migrations
- Install npm dependencies
- Build frontend assets

### 2. Configure Environment

Edit `.env` file for your database and mail settings:

```env
DB_CONNECTION=sqlite
# or configure MySQL/PostgreSQL

MAIL_MAILER=smtp
MAIL_HOST=...

# AI Chatbot Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-3-flash-preview # Configurable model
```

**Get your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 3. Seed the Database (Optional)

```bash
php artisan db:seed
```

This will create sample departments, leave types, users, and leave requests.

## Development

### Start Development Server

```bash
composer dev
```

This runs concurrently:
- Laravel server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Log viewer (`php artisan pail`)
- Vite dev server (`npm run dev`)

Access the app at: **http://localhost:8000**

### Individual Commands

```bash
# Laravel server only
php artisan serve

# Vite dev server only
npm run dev

# Build for production
npm run build
```

## Testing

```bash
# Run all tests
composer test

# Or directly
php artisan test

# With coverage
php artisan test --coverage
```

## Project Structure

```
app/
├── Enums/              # UserRole, LeaveStatus enums
├── Http/
│   ├── Controllers/
│   │   ├── Admin/      # Admin-only controllers
│   │   └── ...         # General controllers
│   ├── Middleware/
│   └── Requests/       # Form request validation
├── Models/             # Eloquent models
├── Policies/           # Authorization policies
└── Providers/

resources/js/
├── Components/         # Reusable React components
├── Layouts/            # Page layouts
├── Pages/              # Inertia page components
└── types/              # TypeScript definitions

database/
├── migrations/         # Database schema
├── factories/          # Model factories
└── seeders/            # Database seeders
```

## User Roles

| Role       | Permissions                                      |
|------------|--------------------------------------------------|
| `admin`    | Full access: manage employees, departments, leave types, reports |
| `manager`  | Approve/reject leave requests for their team     |
| `employee` | Submit and view own leave requests               |

## AI Chatbot Feature 🤖

An intelligent AI assistant powered by **Google Gemini 2.0 Flash** is available on all authenticated pages to help users with leave management queries.

### Features
- **Conversational AI**: Natural language interaction with memory of past conversations
- **Context-Aware**: Understands user role, department, and leave balances
- **Rate Limited**: 20 requests per minute per user to prevent abuse
- **Real-time Responses**: Fast, streaming responses for better UX
- **Floating Interface**: Always accessible via floating button (bottom-right)

### What the Chatbot Can Help With
- Explaining leave policies and procedures
- Answering questions about leave types
- Providing guidance on how to use the system
- General assistance with leave management

### Future Enhancements (RAG-Ready)
The chatbot is architected to support **Retrieval-Augmented Generation (RAG)**:
- Vector database integration for policy documents
- Similarity search for relevant leave policies
- Enhanced context with user-specific data
- See `docs/CHATBOT_IMPLEMENTATION.md` for details

### Usage
1. Click the floating chat button (bottom-right) on any authenticated page
2. Type your question and press Enter
3. Get instant AI-powered responses
4. Conversation history is maintained per session

### Configuration
```env
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-3-flash-preview # Configurable model
```

### Files
- **Agent**: `app/Ai/Agents/ChatbotAgent.php`
- **Controller**: `app/Http/Controllers/ChatbotController.php`
- **Component**: `resources/js/Components/Chatbot.tsx`
- **Routes**: `routes/web.php` (chatbot.* routes)
- **Docs**: `docs/CHATBOT_IMPLEMENTATION.md` (full implementation guide)

## Key Routes

| Route                  | Description                      |
|------------------------|----------------------------------|
| `/dashboard`           | User dashboard                   |
| `/leave`               | Leave requests list              |
| `/leave/create`        | Submit new leave request         |
| `/approvals`           | Pending approvals (manager+)     |
| `/admin/employees`     | Employee management (admin)      |
| `/admin/departments`   | Department management (admin)    |
| `/admin/leave-types`   | Leave type management (admin)    |
| `/admin/reports`       | Reports & export (admin)         |
| `/chatbot/message`     | AI chatbot message endpoint      |
| `/chatbot/stream`      | AI chatbot streaming endpoint    |

## Artisan Commands

```bash
# Clear all caches
php artisan optimize:clear

# Run migrations
php artisan migrate

# Fresh migration with seeders
php artisan migrate:fresh --seed

# Generate IDE helpers (if installed)
php artisan ide-helper:generate
```

## Code Quality

```bash
# Format PHP code
./vendor/bin/pint

# TypeScript type check
npx tsc --noEmit
```

## Deployment

A deployment script is provided:

```bash
./deployment.sh
```

For production builds:

```bash
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## For inertia ssr service deployment

Copy inertia-ssr.service to /etc/systemd/system and run the following commands:

```bash
# Reload systemd to recognize the new service
sudo systemctl daemon-reload
# Enable the inertia-ssr service to start on boot
sudo systemctl enable inertia-ssr
# Start the inertia-ssr service immediately
sudo systemctl start inertia-ssr
```

## License

MIT License
