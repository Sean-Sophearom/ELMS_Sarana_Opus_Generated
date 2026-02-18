git pull
composer install --no-dev --optimize-autoloader
php aritsan migrate --force
npm ci
sudo npm run build

bash deployment/refresh_cache.sh