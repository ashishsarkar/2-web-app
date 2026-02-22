#!/bin/bash

docker stop booking-frontend-dev 2>/dev/null || true
docker rm booking-frontend-dev 2>/dev/null || true
docker system prune -af
docker build -t booking-frontend:dev .
docker run -d -p 3000:3000 --name booking-frontend-dev booking-frontend:dev