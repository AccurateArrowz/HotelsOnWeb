# Environment Setup Guide

## Overview
This guide explains how to set up environment variables for both frontend and backend applications.

## Backend Environment Setup

### 1. Create Environment File
Copy the example file and create your actual environment file:
```bash
cd backend
cp env.example .env
```

### 2. Configure Database
Update the database configuration in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotels_db
DB_USER=your_actual_username
DB_PASSWORD=your_actual_password
```

### 3. Set JWT Secret
Generate a strong JWT secret (you can use a password generator or run this in Node.js):
```javascript
require('crypto').randomBytes(64).toString('hex')
```

Update your `.env`:
```env
JWT_SECRET=your_generated_secret_here
```

### 4. Configure CORS
Set the frontend URL for CORS:
```env
CORS_ORIGIN=http://localhost:5173
```

## Frontend Environment Setup

### 1. Create Environment File
```bash
cd frontend
cp env.example .env
```

### 2. Configure API URL
Make sure the API URL matches your backend:
```env
VITE_API_BASE_URL=http://localhost:5012/api
```

## Environment Variables Explained

### Backend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_HOST` | Database host | Yes | localhost |
| `DB_PORT` | Database port | Yes | 5432 |
| `DB_NAME` | Database name | Yes | hotels_db |
| `DB_USER` | Database username | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `PORT` | Server port | No | 5012 |
| `NODE_ENV` | Environment mode | No | development |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 24h |
| `CORS_ORIGIN` | Allowed CORS origin | No | http://localhost:5173 |

### Frontend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | http://localhost:5012/api |
| `VITE_APP_NAME` | Application name | No | HotelsOnWeb |
| `VITE_NODE_ENV` | Environment mode | No | development |

## Security Best Practices

### 1. Never Commit .env Files
Make sure `.env` files are in your `.gitignore`:
```gitignore
# Environment files
.env
.env.local
.env.production
```

### 2. Use Strong Secrets
- Generate random secrets for JWT
- Use different secrets for different environments
- Rotate secrets regularly

### 3. Environment-Specific Configs
Create different environment files for different stages:
- `.env.development`
- `.env.test`
- `.env.production`

### 4. Validate Environment Variables
Consider adding validation to ensure all required variables are set:

```javascript
// In your server.js or config file
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure database exists

2. **CORS Errors**
   - Verify `CORS_ORIGIN` matches your frontend URL
   - Check if frontend is running on the expected port

3. **JWT Errors**
   - Ensure `JWT_SECRET` is set
   - Check if secret is consistent across restarts

4. **File Upload Issues**
   - Verify `UPLOAD_PATH` directory exists
   - Check file permissions
   - Ensure `MAX_FILE_SIZE` is appropriate

### Debug Mode
Enable debug logging by setting:
```env
LOG_LEVEL=debug
```

## Production Considerations

1. **Use Production Database**
   - Use a managed database service
   - Enable SSL connections
   - Set up proper backup strategies

2. **Secure Headers**
   - Add security middleware
   - Configure HTTPS
   - Set up rate limiting

3. **Environment Variables**
   - Use your hosting platform's environment variable system
   - Never hardcode sensitive values
   - Use secrets management services

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Configure logging services
   - Monitor application performance 