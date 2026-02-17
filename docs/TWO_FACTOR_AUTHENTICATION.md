# Two-Factor Authentication (2FA) Setup Guide

This application now includes email-based two-factor authentication (2FA) for enhanced security. Every login will require users to enter a 6-digit code sent to their email address.

> **⚠️ IMPORTANT: Queue Worker Required**  
> 2FA emails are sent via a queue system. You **must** have a queue worker running for emails to be sent.  
> - **Development (Windows)**: Run `composer dev` (includes queue worker) or see [Queue Setup Guide](QUEUE_WORKER_SETUP.md)  
> - **Production (Linux)**: Queue worker runs automatically as a systemd service after running `setup-vm.sh`

## Features

- **Email-Based 2FA**: Users receive a 6-digit verification code via email after entering their credentials
- **Automatic Enforcement**: 2FA is enabled by default for all users
- **Code Expiration**: Verification codes expire after 10 minutes
- **Resend Functionality**: Users can request a new code if needed
- **Rate Limiting**: Protection against brute force attacks

## Gmail SMTP Configuration

To send 2FA codes via Gmail, you need to configure your `.env` file with Gmail SMTP settings.

### Step 1: Generate Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** > **2-Step Verification** (you must enable 2FA on your Google account first)
3. Scroll down to **App passwords**
4. Click **Select app** and choose **Mail**
5. Click **Select device** and choose **Other (Custom name)**
6. Enter a name like "ELMS Application"
7. Click **Generate**
8. Copy the 16-character password (without spaces)

### Step 2: Update .env File

Add or update the following environment variables in your `.env` file:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password you generated

### Step 3: Run Migrations

Run the database migration to add 2FA fields to the users table:

```bash
php artisan migrate
```

### Step 4: Clear Configuration Cache

After updating the `.env` file, clear the configuration cache:

```bash
php artisan config:clear
php artisan cache:clear
```

### Step 5: Start Queue Worker (Development)

**For development**, start the queue worker to process email jobs:

```bash
# Option 1: Use the dev script (recommended - includes queue worker)
composer dev

# Option 2: Run queue worker manually in a separate terminal
php artisan queue:work
```

See [Queue Worker Setup Guide](QUEUE_WORKER_SETUP.md) for detailed instructions.

**For production**, the queue worker runs automatically as a systemd service.

## How It Works

### Login Flow

1. User enters email and password on the login page
2. System validates credentials
3. If credentials are valid and 2FA is enabled:
   - A 6-digit code is generated
   - Code is sent to user's email address
   - User is redirected to the 2FA verification page
4. User enters the code from their email
5. If code is valid and not expired, user is logged in
6. If code is invalid or expired, user sees an error message

### User Experience

- **First-time setup**: No setup required - 2FA is automatically enabled
- **Code delivery**: Codes are sent instantly via email
- **Code validity**: Each code is valid for 10 minutes
- **Resend option**: Users can request a new code if needed
- **Rate limiting**: Maximum 3 resend requests per minute

## Security Features

1. **Secure Code Storage**: Codes are stored in the database with expiration timestamps
2. **Timing-Safe Comparison**: Uses `hash_equals()` to prevent timing attacks
3. **Session-Based Flow**: User information is stored in session during 2FA verification
4. **Rate Limiting**: Login attempts and code resends are rate-limited
5. **Automatic Cleanup**: Expired codes are automatically reset after verification

## Disabling 2FA for Specific Users

If you need to disable 2FA for specific users (e.g., for testing), you can update the `two_factor_enabled` field in the database:

```sql
UPDATE users SET two_factor_enabled = 0 WHERE email = 'user@example.com';
```

Or in your application code:

```php
$user = User::where('email', 'user@example.com')->first();
$user->two_factor_enabled = false;
$user->save();
```

## Troubleshooting

### Emails Not Sending

1. **Verify Gmail credentials**: Make sure you're using an App Password, not your regular Gmail password
2. **Check allow less secure apps**: This is no longer needed with App Passwords
3. **Check logs**: Look at `storage/logs/laravel.log` for error messages
4. **Test email configuration**:
   ```bash
   php artisan tinker
   Mail::raw('Test email', function($msg) {
       $msg->to('your-email@gmail.com')->subject('Test');
   });
   ```

### Code Not Working

1. **Check expiration**: Codes expire after 10 minutes
2. **Request new code**: Use the "Resend" button to get a fresh code
3. **Check email**: Make sure you're using the most recent code

### Session Issues

1. **Clear sessions**:
   ```bash
   php artisan session:clear
   ```
2. **Check session configuration** in `config/session.php`

## Alternative Email Providers

While this guide uses Gmail, you can use other email providers by updating the SMTP settings:

### SendGrid
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
```

### Mailgun
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-username
MAIL_PASSWORD=your-mailgun-password
MAIL_ENCRYPTION=tls
```

### AWS SES
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
```

## Database Schema

The migration adds the following fields to the `users` table:

- `two_factor_code` (string, nullable): The current verification code
- `two_factor_expires_at` (timestamp, nullable): When the code expires
- `two_factor_enabled` (boolean, default: true): Whether 2FA is enabled for the user

## API Endpoints

- `GET /two-factor-challenge` - Show 2FA verification page
- `POST /two-factor-challenge` - Verify 2FA code
- `POST /two-factor-challenge/resend` - Resend verification code

## Code Components

### Backend
- **Migration**: `database/migrations/2026_02_17_000001_add_two_factor_authentication_to_users_table.php`
- **Model**: `app/Models/User.php` (updated with 2FA methods)
- **Notification**: `app/Notifications/TwoFactorCode.php`
- **Controller**: `app/Http/Controllers/Auth/TwoFactorController.php`
- **Auth Controller**: `app/Http/Controllers/Auth/AuthenticatedSessionController.php` (updated)

### Frontend
- **Page**: `resources/js/Pages/Auth/TwoFactorChallenge.tsx`

### Routes
- **Auth Routes**: `routes/auth.php` (updated with 2FA routes)
