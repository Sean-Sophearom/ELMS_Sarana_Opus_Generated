git pull
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl restart inertia-ssr
sudo systemctl reload php8.4-fpm