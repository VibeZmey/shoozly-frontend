#!/bin/sh

# Установка mc внутри контейнера MinIO
echo "Installing MinIO Client..."
wget -q https://dl.min. io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc
chmod +x /usr/local/bin/mc

# Ожидание запуска MinIO
echo "Waiting for MinIO to start..."
until mc alias set myminio http://localhost:9000 minioadmin minioadmin123 2>/dev/null; do
  sleep 2
done

echo "MinIO is ready!"

# Создание bucket
echo "Creating bucket 'images'..."
mc mb myminio/images --ignore-existing

# Установка публичного доступа
echo "Setting bucket to public..."
mc anonymous set download myminio/images

# Создание Service Account
echo "Creating Service Account..."
echo "================================="
mc admin user svcacct add myminio minioadmin
echo "================================="
echo "SAVE THESE CREDENTIALS!"

echo "MinIO initialization complete!"