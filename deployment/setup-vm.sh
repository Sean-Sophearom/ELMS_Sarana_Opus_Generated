#!/bin/bash

################################################################################
# Fresh Google Cloud VM Setup Script for Laravel + Inertia.js Application
# PHP 8.4 | Node.js | Nginx | PostgreSQL
################################################################################

set -e  # Exit on error

echo "============================================"
echo "Starting VM Setup for Laravel Application"
echo "============================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Configuration variables
APP_NAME="sarana"
APP_DIR="/var/www/${APP_NAME}"
DOMAIN="${DOMAIN:-your-domain.com}"  # Override with: DOMAIN=example.com ./setup-vm.sh
DB_NAME="${DB_NAME:-sarana_db}"
DB_USER="${DB_USER:-sarana_user}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 32)}"

echo "Configuration:"
echo "  App Directory: $APP_DIR"
echo "  Domain: $DOMAIN"
echo "  Database: $DB_NAME"
echo ""

# ============================================
# 1. System Update
# ============================================
print_status "Updating system packages..."
apt-get update
apt-get upgrade -y
apt-get install -y software-properties-common curl wget git unzip gnupg2 ca-certificates lsb-release apt-transport-https

# ============================================
# 2. Install PHP 8.4 and Extensions
# ============================================
print_status "Adding PHP 8.4 repository..."
add-apt-repository ppa:ondrej/php -y
apt-get update

print_status "Installing PHP 8.4 and extensions..."
apt-get install -y \
    php8.4-fpm \
    php8.4-cli \
    php8.4-common \
    php8.4-mysql \
    php8.4-pgsql \
    php8.4-mbstring \
    php8.4-xml \
    php8.4-bcmath \
    php8.4-curl \
    php8.4-gd \
    php8.4-zip \
    php8.4-intl \
    php8.4-redis \
    php8.4-opcache

# Verify PHP installation
php -v
print_status "PHP 8.4 installed successfully"

# ============================================
# 3. Configure PHP-FPM
# ============================================
print_status "Configuring PHP-FPM..."
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php/8.4/fpm/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/' /etc/php/8.4/fpm/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 64M/' /etc/php/8.4/fpm/php.ini
sed -i 's/memory_limit = 128M/memory_limit = 512M/' /etc/php/8.4/fpm/php.ini
sed -i 's/max_execution_time = 30/max_execution_time = 300/' /etc/php/8.4/fpm/php.ini

# Enable opcache for better performance
cat >> /etc/php/8.4/fpm/conf.d/99-custom.ini <<EOF
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
EOF

systemctl enable php8.4-fpm
systemctl restart php8.4-fpm
print_status "PHP-FPM configured and started"

# ============================================
# 4. Install Composer
# ============================================
print_status "Installing Composer..."
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
composer --version
print_status "Composer installed successfully"

# ============================================
# 5. Install Node.js 20 LTS
# ============================================
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node --version
npm --version
print_status "Node.js installed successfully"

# ============================================
# 6. Install Nginx
# ============================================
print_status "Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx
print_status "Nginx installed successfully"

# ============================================
# 7. Install PostgreSQL
# ============================================
print_status "Installing PostgreSQL Server..."
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

print_status "Configuring PostgreSQL..."
# Create database and user
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -c "ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};"

# For PostgreSQL 15+, grant schema privileges
sudo -u postgres psql -d ${DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"

# Configure PostgreSQL to allow password authentication
PG_VERSION=$(psql --version | grep -oP '\d+' | head -1)
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

# Backup original config
cp ${PG_HBA} ${PG_HBA}.backup

# Allow local connections with password
if ! grep -q "host.*${DB_NAME}.*${DB_USER}.*md5" ${PG_HBA}; then
    echo "host    ${DB_NAME}    ${DB_USER}    127.0.0.1/32    md5" >> ${PG_HBA}
    echo "host    ${DB_NAME}    ${DB_USER}    ::1/128         md5" >> ${PG_HBA}
fi

# Restart PostgreSQL to apply changes
systemctl restart postgresql

print_status "PostgreSQL configured successfully"

# ============================================
# 8. Install Redis (optional but recommended)
# ============================================
print_status "Installing Redis..."
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server
print_status "Redis installed successfully"

# ============================================
# 9. Configure Firewall
# ============================================
print_status "Configuring firewall..."
apt-get install -y ufw
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 80/tcp
ufw allow 443/tcp
ufw status
print_status "Firewall configured"

# ============================================
# 10. Create Application Directory
# ============================================
print_status "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Set proper ownership
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR

print_status "Application directory created: $APP_DIR"

# ============================================
# 11. Configure Nginx
# ============================================
print_status "Configuring Nginx for Laravel..."
cat > /etc/nginx/sites-available/${APP_NAME} <<'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER;
    root /var/www/APP_NAME_PLACEHOLDER/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Additional security headers
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
NGINXCONF

# Replace placeholders
sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" /etc/nginx/sites-available/${APP_NAME}
sed -i "s/APP_NAME_PLACEHOLDER/${APP_NAME}/g" /etc/nginx/sites-available/${APP_NAME}

# Enable the site
ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t
systemctl restart nginx
print_status "Nginx configured successfully"

# ============================================
# 12. Setup Inertia SSR Service
# ============================================
print_status "Configuring Inertia SSR service..."
cat > /etc/systemd/system/inertia-ssr.service <<SERVICECONF
[Unit]
Description=Inertia SSR Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/php artisan inertia:start-ssr
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=inertia-ssr

[Install]
WantedBy=multi-user.target
SERVICECONF

systemctl daemon-reload
systemctl enable inertia-ssr
print_status "Inertia SSR service configured"

# ============================================
# 13. Setup Laravel Queue Worker (optional)
# ============================================
print_status "Configuring Laravel Queue Worker service..."
cat > /etc/systemd/system/laravel-queue.service <<QUEUECONF
[Unit]
Description=Laravel Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=laravel-queue

[Install]
WantedBy=multi-user.target
QUEUECONF

systemctl daemon-reload
systemctl enable laravel-queue
print_status "Laravel Queue Worker service configured"

# ============================================
# 14. Setup Laravel Scheduler Cron
# ============================================
print_status "Setting up Laravel Scheduler..."
(crontab -u www-data -l 2>/dev/null; echo "* * * * * cd ${APP_DIR} && php artisan schedule:run >> /dev/null 2>&1") | crontab -u www-data -
print_status "Laravel Scheduler configured"

# ============================================
# 15. Install Certbot for SSL (Let's Encrypt)
# ============================================
print_status "Installing Certbot for SSL certificates..."
apt-get install -y certbot python3-certbot-nginx
print_status "Certbot installed. Run 'sudo certbot --nginx -d $DOMAIN' after deploying your app"

# ============================================
# 16. Create .env template
# ============================================
print_status "Creating .env template..."
cat > ${APP_DIR}/.env.example <<ENVCONF
APP_NAME=Laravel
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=http://${DOMAIN}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=${DB_NAME}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis

CACHE_STORE=redis
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="\${APP_NAME}"
ENVCONF

print_status ".env template created"

# ============================================
# 17. Set proper permissions
# ============================================
print_status "Setting proper permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
# These directories need to be writable
mkdir -p ${APP_DIR}/storage ${APP_DIR}/bootstrap/cache
chmod -R 775 ${APP_DIR}/storage ${APP_DIR}/bootstrap/cache
chown -R www-data:www-data ${APP_DIR}/storage ${APP_DIR}/bootstrap/cache

# ============================================
# 18. Create deployment helper script
# ============================================
print_status "Creating deployment helper script..."
cat > /usr/local/bin/deploy-${APP_NAME} <<'DEPLOYCONF'
#!/bin/bash
set -e

APP_DIR="/var/www/APP_NAME_PLACEHOLDER"
cd $APP_DIR

echo "Starting deployment..."

# Pull latest code
git pull

# Install/update dependencies
composer install --no-dev --optimize-autoloader --no-interaction
npm ci

# Build assets
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache configs
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo systemctl restart inertia-ssr
sudo systemctl restart laravel-queue
sudo systemctl reload php8.4-fpm

echo "Deployment completed successfully!"
DEPLOYCONF

sed -i "s/APP_NAME_PLACEHOLDER/${APP_NAME}/g" /usr/local/bin/deploy-${APP_NAME}
chmod +x /usr/local/bin/deploy-${APP_NAME}
print_status "Deployment script created: /usr/local/bin/deploy-${APP_NAME}"

# ============================================
# 19. Install useful utilities
# ============================================
print_status "Installing additional utilities..."
apt-get install -y htop vim nano ncdu fail2ban

# Configure fail2ban for SSH protection
systemctl enable fail2ban
systemctl start fail2ban
print_status "Additional utilities installed"

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
echo -e "${GREEN}VM Setup Completed Successfully!${NC}"
echo "============================================"
echo ""
echo "📋 Configuration Summary:"
echo "  • PHP Version: $(php -v | head -n 1)"
echo "  • Node.js Version: $(node -v)"
echo "  • Composer Version: $(composer --version --no-ansi | head -n 1)"
echo "  • App Directory: $APP_DIR"
echo "  • Nginx Config: /etc/nginx/sites-available/${APP_NAME}"
echo ""
echo "🗄️  Database Information:"
echo "  • Database: $DB_NAME"
echo "  • Username: $DB_USER"
echo "  • Password: $DB_PASSWORD"
echo ""
echo "📝 Next Steps:"
echo "  1. Clone your application to ${APP_DIR}:"
echo "     cd ${APP_DIR}"
echo "     git clone <your-repo-url> ."
echo ""
echo "  2. Copy and configure .env file:"
echo "     cp .env.example .env"
echo "     nano .env"
echo ""
echo "  3. Install application dependencies:"
echo "     composer install --no-dev --optimize-autoloader"
echo "     npm ci"
echo "     npm run build"
echo ""
echo "  4. Generate application key:"
echo "     php artisan key:generate"
echo ""
echo "  5. Run migrations:"
echo "     php artisan migrate --force"
echo "     php artisan db:seed --force  # if you have seeders"
echo ""
echo "  6. Start services:"
echo "     systemctl start inertia-ssr"
echo "     systemctl start laravel-queue"
echo ""
echo "  7. Setup SSL certificate:"
echo "     certbot --nginx -d ${DOMAIN}"
echo ""
echo "  8. For future deployments, run:"
echo "     deploy-${APP_NAME}"
echo ""
echo "🔐 Security Reminders:"
echo "  • Change the database password in .env"
echo "  • Configure your domain DNS to point to this server"
echo "  • Setup SSL certificate with certbot"
echo "  • Review firewall rules: ufw status"
echo "  • Consider setting up automated backups"
echo ""
echo "📊 Useful Commands:"
echo "  • Check PHP-FPM status: systemctl status php8.4-fpm"
echo "  • Check Nginx status: systemctl status nginx"
echo "  • Check SSR service: systemctl status inertia-ssr"
echo "  • Check Queue worker: systemctl status laravel-queue"
echo "  • View Laravel logs: tail -f ${APP_DIR}/storage/logs/laravel.log"
echo "  • View Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
echo "Database credentials saved to: /root/.db_credentials"
echo "$DB_NAME|$DB_USER|$DB_PASSWORD" > /root/.db_credentials
chmod 600 /root/.db_credentials

print_status "Setup complete! Your server is ready for Laravel deployment."
