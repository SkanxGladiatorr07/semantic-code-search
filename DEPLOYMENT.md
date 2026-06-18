# Deployment Guide

## Environment Setup

### Backend Environment Variables

Create `.env` file in `backend/` directory:

```env
NODE_ENV=production
PORT=5000

DATABASE_HOST=your_production_db_host
DATABASE_PORT=3306
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=semantic_search_database
DATABASE_CONNECTION_LIMIT=10
DATABASE_CONNECT_TIMEOUT=10000

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MAX_TOKENS=8000
GROQ_TEMPERATURE=0.7

CLIENT_URL=https://your-frontend-domain.com

CLONE_DIRECTORY=cloned_repos
CLONE_TIMEOUT=300000

MAX_FILE_SIZE=10485760
MAX_FILES=50000
MAX_DEPTH=20
MAX_SYMBOLS=100000
MAX_FILES_TO_PARSE=10000
```

### Frontend Environment Variables

Create `.env.production` file in `frontend/` directory:

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Semantic Code Search
VITE_APP_VERSION=1.0.0
```

## Database Setup

### Create Database

```sql
CREATE DATABASE semantic_search_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Create Database User (Production)

```sql
CREATE USER 'semantic_user'@'%' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON semantic_search_database.* TO 'semantic_user'@'%';
FLUSH PRIVILEGES;
```

### Tables Auto-Creation

Tables are automatically created on first server start.

## Backend Deployment

### Install Dependencies

```bash
cd backend
npm install --production
```

### Start Server

```bash
npm start
```

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start server.js --name semantic-search-api
pm2 save
pm2 startup
```

## Frontend Deployment

### Build for Production

```bash
cd frontend
npm install
npm run build:prod
```

### Serve Static Files

#### Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Using Node.js Server

```bash
npm install -g serve
serve -s dist -l 4173
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong database credentials
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure CORS origins
- [ ] Keep API keys in environment variables only
- [ ] Never commit `.env` files to git
- [ ] Set `NODE_ENV=production`
- [ ] Use firewall to restrict database access
- [ ] Regular security updates
- [ ] Monitor error logs

## Performance Optimization

### Backend
- Use connection pooling (configured)
- Enable gzip compression
- Set appropriate timeout values
- Monitor memory usage
- Use PM2 for process management

### Frontend
- Build output is optimized with Vite
- Code splitting enabled
- Minification enabled
- Remove sourcemaps in production

## Monitoring

### Backend Logs

```bash
pm2 logs semantic-search-api
```

### Health Check Endpoint

```
GET http://your-api-domain.com/api/health
```

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials
- Check port availability
- Review error logs

### Frontend 404 errors
- Ensure nginx/server configured for SPA routing
- Check API_URL in environment variables
- Verify CORS settings

### Database connection errors
- Check firewall rules
- Verify database host/port
- Test connection manually with mysql client
- Check user permissions

## Backup Strategy

### Database Backup

```bash
mysqldump -u username -p semantic_search_database > backup.sql
```

### Restore Database

```bash
mysql -u username -p semantic_search_database < backup.sql
```

## Scaling Considerations

- Use Redis for caching (future enhancement)
- Implement rate limiting
- Use CDN for frontend assets
- Database read replicas for high traffic
- Load balancer for multiple backend instances
