# Queue Worker Setup Guide

This guide explains how to run Laravel queue workers in both development (Windows) and production (Linux) environments.

## Why Queue Workers?

Queue workers process background jobs like sending emails (2FA codes). Without a queue worker running:
- Jobs pile up in the `jobs` database table
- Emails/notifications won't be sent
- Background tasks won't execute

## Development (Windows)

### Option 1: Use the Built-in Dev Script (Recommended)

The easiest way is to use the `composer dev` command which already includes a queue worker:

```bash
composer dev
```

This runs 4 processes concurrently:
1. **PHP Server** - `php artisan serve`
2. **Queue Worker** - `php artisan queue:listen --tries=1`
3. **Logs** - `php artisan pail --timeout=0`
4. **Vite** - `npm run dev`

The queue worker will automatically process jobs as they come in.

### Option 2: Run Queue Worker Separately

If you prefer to run services separately:

**Terminal 1 - Queue Worker:**
```powershell
php artisan queue:work --sleep=3 --tries=3
```

**Terminal 2 - Dev Server:**
```powershell
php artisan serve
```

**Terminal 3 - Vite:**
```powershell
npm run dev
```

### Option 3: Queue Worker as a Windows Service (Advanced)

For a more permanent solution, you can use NSSM (Non-Sucking Service Manager):

1. Download NSSM: https://nssm.cc/download
2. Install as service:
```powershell
nssm install LaravelQueue "C:\Path\To\php.exe" "artisan queue:work --sleep=3 --tries=3"
nssm set LaravelQueue AppDirectory "D:\Code\ELMS_Sarana_Opus_Generated"
nssm start LaravelQueue
```

### Development Commands

```bash
# See what's in the queue
php artisan queue:monitor

# Process one job
php artisan queue:work --once

# Clear failed jobs
php artisan queue:flush

# Retry failed jobs
php artisan queue:retry all

# View queue status
php artisan queue:failed
```

## Production (Linux)

### Automatic Setup (Included in setup-vm.sh)

The queue worker is automatically configured when you run the VM setup script:

```bash
sudo bash deployment/setup-vm.sh
```

This creates a systemd service at `/etc/systemd/system/laravel-queue.service` that:
- Starts automatically on boot
- Restarts automatically if it crashes
- Runs as `www-data` user
- Logs to syslog

### Manual Setup

If you need to set it up manually:

1. **Copy the service file:**
```bash
sudo cp deployment/laravel-queue.service /etc/systemd/system/
```

2. **Update the service file paths if needed:**
```bash
sudo nano /etc/systemd/system/laravel-queue.service
```

3. **Enable and start the service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable laravel-queue
sudo systemctl start laravel-queue
```

### Production Commands

```bash
# Check queue worker status
sudo systemctl status laravel-queue

# View queue worker logs
sudo journalctl -u laravel-queue -f

# Restart queue worker (after code changes)
sudo systemctl restart laravel-queue

# Stop queue worker
sudo systemctl stop laravel-queue

# Start queue worker
sudo systemctl start laravel-queue

# Disable auto-start
sudo systemctl disable laravel-queue
```

### Restarting After Deployment

**Important:** After deploying new code, you must restart the queue worker because it keeps the application in memory.

Add to your deployment script:
```bash
sudo systemctl restart laravel-queue
```

Or use Laravel's built-in restart:
```bash
php artisan queue:restart
```

## Queue Configuration

### Queue Connection

In `.env`:
```env
QUEUE_CONNECTION=database  # Using database queue
```

Other options:
- `sync` - Jobs run immediately (no worker needed, dev only)
- `redis` - Faster, requires Redis
- `sqs` - AWS SQS
- `beanstalkd` - Beanstalk queue

### Queue Settings

`.env` configuration:
```env
QUEUE_CONNECTION=database
QUEUE_FAILED_DRIVER=database
```

## Monitoring

### Check Queue Size

```bash
# Development (Windows PowerShell or Linux)
php artisan tinker --execute="echo \DB::table('jobs')->count() . ' jobs in queue';"
```

### Monitor Failed Jobs

```bash
# List failed jobs
php artisan queue:failed

# Retry specific failed job
php artisan queue:retry {job-id}

# Retry all failed jobs
php artisan queue:retry all

# Delete failed jobs
php artisan queue:flush
```

### Production Monitoring

Check logs:
```bash
# View live logs
sudo journalctl -u laravel-queue -f

# View last 100 lines
sudo journalctl -u laravel-queue -n 100

# View logs from today
sudo journalctl -u laravel-queue --since today
```

## Troubleshooting

### Jobs Not Processing

**Check if worker is running:**
```bash
# Windows
tasklist | findstr php

# Linux
sudo systemctl status laravel-queue
# or
ps aux | grep "queue:work"
```

**Check for errors:**
```bash
# Windows - check Laravel logs
cat storage/logs/laravel.log

# Linux - check service logs
sudo journalctl -u laravel-queue -n 50
```

### Worker Not Restarting After Code Changes

Queue workers keep the application in memory. After code changes:

```bash
# Development - stop and restart
Ctrl+C  # Stop the worker
php artisan queue:work  # Start again

# Production
sudo systemctl restart laravel-queue
# or
php artisan queue:restart
```

### High Memory Usage

Add memory limits:
```bash
# Restart worker after 512MB
php artisan queue:work --memory=512

# Process max 1000 jobs then restart
php artisan queue:work --max-jobs=1000

# Restart after 1 hour
php artisan queue:work --max-time=3600
```

Update production service file:
```ini
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600 --memory=512
```

### Jobs Failing

Check failed jobs table:
```bash
php artisan queue:failed
```

View specific failure:
```bash
# Get details of failed job
php artisan tinker
>>> \DB::table('failed_jobs')->latest()->first();
```

## Performance Tips

### 1. Use Redis for Queue (Faster)

Install Redis:
```bash
# Linux
sudo apt install redis-server

# Update .env
QUEUE_CONNECTION=redis
```

### 2. Multiple Workers

Run multiple workers for better throughput:

```bash
# Worker for high-priority queue
php artisan queue:work --queue=high,default

# Worker for emails only
php artisan queue:work --queue=emails

# Worker for slow jobs
php artisan queue:work --queue=long-running --timeout=600
```

### 3. Supervisor (Production Alternative)

Instead of systemd, you can use Supervisor:

```bash
sudo apt install supervisor

# Create config
sudo nano /etc/supervisor/conf.d/laravel-queue.conf
```

Example supervisor config:
```ini
[program:laravel-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/sarana/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/sarana/storage/logs/queue-worker.log
stopwaitsecs=3600
```

## Quick Reference

| Task | Windows (Dev) | Linux (Prod) |
|------|---------------|--------------|
| Start worker | `php artisan queue:work` | `sudo systemctl start laravel-queue` |
| Stop worker | `Ctrl+C` | `sudo systemctl stop laravel-queue` |
| Restart worker | Stop & start | `sudo systemctl restart laravel-queue` |
| View logs | `cat storage/logs/laravel.log` | `sudo journalctl -u laravel-queue -f` |
| Check status | `tasklist \| findstr php` | `sudo systemctl status laravel-queue` |
| Process one job | `php artisan queue:work --once` | Same |
| View failed jobs | `php artisan queue:failed` | Same |

## Testing 2FA Email Queue

1. **Start the queue worker** (if not running)
2. **Attempt to login** - this creates a queue job
3. **Check the queue** - should process within seconds
4. **Check logs** - should see email content in logs

```bash
# Watch logs in real-time (Windows)
Get-Content storage\logs\laravel.log -Wait -Tail 50

# Watch logs in real-time (Linux)
tail -f storage/logs/laravel.log
```
