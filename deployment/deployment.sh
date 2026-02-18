git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
npm ci
sudo npm run build

bash deployment/refresh_cache.sh