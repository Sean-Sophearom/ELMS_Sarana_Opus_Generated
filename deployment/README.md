# Deployment Files

This directory contains configuration files and scripts for deploying the application to production Linux servers.

## Files

### setup-vm.sh
Complete Ubuntu/Debian server setup script that installs and configures:
- PHP 8.4 + Extensions
- Nginx web server
- PostgreSQL database
- Node.js 20 LTS
- Composer
- SSL certificates (Let's Encrypt)
- Systemd services (Inertia SSR + Queue Worker)

**Usage:**
```bash
# Basic setup
sudo bash deployment/setup-vm.sh

# With custom domain and database
DOMAIN=example.com DB_NAME=myapp DB_USER=myuser sudo bash deployment/setup-vm.sh
```

### inertia-ssr.service
Systemd service file for running the Inertia.js SSR server.

**Automatically installed by setup-vm.sh**

Manual installation:
```bash
sudo cp deployment/inertia-ssr.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable inertia-ssr
sudo systemctl start inertia-ssr
```

### laravel-queue.service
Systemd service file for running the Laravel queue worker (processes background jobs like sending 2FA emails).

**Automatically installed by setup-vm.sh**

Manual installation:
```bash
sudo cp deployment/laravel-queue.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable laravel-queue
sudo systemctl start laravel-queue
```

### deployment.sh
Automated deployment script for updating the application on a running server.

**Usage:**
```bash
bash deployment/deployment.sh
```

## Service Management

After deployment, manage services with:

```bash
# Check status
sudo systemctl status inertia-ssr
sudo systemctl status laravel-queue

# View logs
sudo journalctl -u inertia-ssr -f
sudo journalctl -u laravel-queue -f

# Restart after code changes
sudo systemctl restart inertia-ssr
sudo systemctl restart laravel-queue

# Stop/Start
sudo systemctl stop laravel-queue
sudo systemctl start laravel-queue
```

## Important Notes

1. **Queue Worker**: Must be restarted after every deployment for code changes to take effect
2. **Inertia SSR**: Must be restarted after frontend changes
3. **Nginx**: Automatically serves static assets, proxy requests to PHP-FPM
4. **Database**: PostgreSQL runs on localhost:5432

## Environment Variables

The setup script will prompt for or generate:
- Database credentials
- Application key
- Domain name
- SSL configuration

Make sure to secure your `.env` file:
```bash
chmod 600 /var/www/sarana/.env
chown www-data:www-data /var/www/sarana/.env
```
