# Deployment Guide

This guide covers deploying the Clicker Game application using Docker.

## Prerequisites

- Docker and Docker Compose installed
- MongoDB Atlas account (or MongoDB instance)
- Environment variables configured

## Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
DB_ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/clicker_game
JWT_SECRET=your-secret-jwt-key-here

# Frontend
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

For production, update `VITE_API_URL` and `VITE_SOCKET_URL` to your backend domain:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

## Local Deployment with Docker Compose

1. **Build and start services:**
   ```bash
   docker-compose up -d --build
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

4. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

## Production Deployment Options

### Option 1: Railway (Recommended for beginners)

1. **Create Railway account** at https://railway.app
2. **Create new project** and connect your GitHub repo
3. **Add MongoDB** service
4. **Deploy backend:**
   - Set root directory to `backend`
   - Add environment variables:
     - `DB_ATLAS_URL`
     - `JWT_SECRET`
     - `PORT=3000`
5. **Deploy frontend:**
   - Set root directory to `frontend`
   - Add build command: `npm run build`
   - Add start command: `npm run preview` (or use nginx)
   - Set environment variable: `VITE_API_URL` to your backend URL

### Option 2: Render

1. **Backend Service:**
   - Create new Web Service
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables: `DB_ATLAS_URL`, `JWT_SECRET`, `PORT`

2. **Frontend Static Site:**
   - Create new Static Site
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL` (your backend URL)

### Option 3: DigitalOcean App Platform

1. **Create App** from GitHub repository
2. **Add Backend Service:**
   - Type: Web Service
   - Source directory: `backend`
   - Build command: `npm install`
   - Run command: `npm start`
   - Environment variables: `DB_ATLAS_URL`, `JWT_SECRET`, `PORT`

3. **Add Frontend Service:**
   - Type: Static Site
   - Source directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `VITE_API_URL`

### Option 4: VPS (DigitalOcean Droplet, AWS EC2, etc.)

1. **SSH into your server**
2. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo apt-get install docker-compose-plugin
   ```

3. **Clone your repository:**
   ```bash
   git clone your-repo-url
   cd clicker-game
   ```

4. **Create `.env` file** with your environment variables

5. **Start services:**
   ```bash
   docker-compose up -d --build
   ```

6. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:80;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Updating the Application

1. **Pull latest changes:**
   ```bash
   git pull
   ```

2. **Rebuild and restart:**
   ```bash
   docker-compose up -d --build
   ```

## Troubleshooting

### CORS Issues
- Ensure `VITE_API_URL` matches your backend URL
- Check that backend CORS is configured to allow your frontend domain

### Socket.IO Connection Issues
- Ensure `VITE_SOCKET_URL` is set correctly
- Check that WebSocket connections are allowed through your firewall/proxy

### Database Connection Issues
- Verify `DB_ATLAS_URL` is correct
- Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0` for testing)

## Security Notes

- Never commit `.env` files to version control
- Use strong `JWT_SECRET` in production
- Restrict MongoDB Atlas IP whitelist in production
- Use HTTPS in production
- Consider restricting CORS to specific domains in production

