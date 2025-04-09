# Creze

## Overview
Creze is a full-stack web application with a Django backend and a React frontend, implementing secure user authentication and Time-Based One-Time Password (TOTP) Multi-Factor Authentication (MFA).

## Prerequisites
- Docker
- Docker Compose

## Project Structure
```
Creze/
├── backend/         # Django project
│   ├── Dockerfile   # Backend Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   └── ...
├── frontend/        # React project
│   ├── Dockerfile   # Frontend Dockerfile
│   ├── package.json
│   └── ...
└── docker-compose.yml
```

## Environment Variables
Create a file `backend/.env`:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Create a file `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

## Docker Setup
1. Build and start services:
```bash
docker-compose up --build -d
```
2. Run backend migrations:
```bash
docker-compose exec backend python manage.py migrate
```

## Access
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000

## Dockerfile (backend/Dockerfile)
```dockerfile
FROM python:3.10-slim
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
ENV PYTHONUNBUFFERED=1
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## Dockerfile (frontend/Dockerfile)
```dockerfile
FROM node:16-alpine
WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend/ .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
```

## docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    env_file:
      - backend/.env
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app/backend
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    env_file:
      - frontend/.env
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app/frontend
```

## AWS Deploy
*Instructions for deploying on AWS will be added here.*

