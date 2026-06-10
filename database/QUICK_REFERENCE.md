# Database & API Quick Reference

## 🗃️ Database Schema

### Repositories Table
```sql
CREATE TABLE repositories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repository_name VARCHAR(255) NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better query performance
    INDEX idx_repository_name (repository_name),
    INDEX idx_created_at (created_at),
    
    -- Ensure unique GitHub URLs
    UNIQUE KEY unique_github_url (github_url),
    
    -- Ensure valid GitHub URLs
    CHECK (github_url LIKE 'https://github.com/%/%')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Sample Data
```sql
INSERT INTO repositories (repository_name, github_url, description) VALUES
('React', 'https://github.com/facebook/react', 'A declarative, efficient, and flexible JavaScript library for building user interfaces.'),
('Node.js', 'https://github.com/nodejs/node', 'Node.js JavaScript runtime'),
('Express', 'https://github.com/expressjs/express', 'Fast, unopinionated, minimalist web framework for Node.js'),
('Vite', 'https://github.com/vitejs/vite', 'Next generation frontend tooling'),
('TypeScript', 'https://github.com/microsoft/TypeScript', 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.');
```

## 🌐 API Endpoints

### Base URL: `http://localhost:5000/api`

### Health Check
- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed system info

### Repository Management
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| `GET` | `/repositories` | Get all repositories | None |
| `GET` | `/repositories/:id` | Get single repository | None |
| `POST` | `/repositories` | Create repository | `repository_name`, `github_url` |
| `PUT` | `/repositories/:id` | Update repository | At least one field |
| `DELETE` | `/repositories/:id` | Delete repository | None |
| `GET` | `/repositories/search?q=:query` | Search repositories | `q` (min 2 chars) |

## 📝 Request/Response Examples

### Create Repository
**Request:**
```bash
curl -X POST http://localhost:5000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{
    "repository_name": "Vue.js",
    "github_url": "https://github.com/vuejs/vue",
    "description": "Progressive JavaScript Framework"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Repository created successfully",
  "data": {
    "id": 6,
    "repository_name": "Vue.js",
    "github_url": "https://github.com/vuejs/vue",
    "description": "Progressive JavaScript Framework",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Repository name and GitHub URL are required"
}
```

### Get All Repositories
**Request:**
```bash
curl http://localhost:5000/api/repositories
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "repository_name": "React",
      "github_url": "https://github.com/facebook/react",
      "description": "A declarative, efficient, and flexible JavaScript library...",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    // ... more repositories
  ]
}
```

### Search Repositories
**Request:**
```bash
curl "http://localhost:5000/api/repositories/search?q=react"
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "query": "react",
  "data": [
    {
      "id": 1,
      "repository_name": "React",
      "github_url": "https://github.com/facebook/react",
      "description": "A declarative, efficient, and flexible JavaScript library...",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

## 🔧 Database Commands

### Access MySQL
```bash
mysql -u root -p
```

### Common Queries
```sql
-- Use database
USE code_search_db;

-- Show tables
SHOW TABLES;

-- Describe repositories table
DESCRIBE repositories;

-- View all repositories
SELECT * FROM repositories;

-- Count repositories
SELECT COUNT(*) as total_repositories FROM repositories;

-- Find repositories created today
SELECT * FROM repositories WHERE DATE(created_at) = CURDATE();

-- Search repositories
SELECT * FROM repositories 
WHERE repository_name LIKE '%react%' 
   OR description LIKE '%react%';
```

### Database Management
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE code_search_db;"

# Drop database (careful!)
mysql -u root -p -e "DROP DATABASE code_search_db;"

# Import schema
mysql -u root -p code_search_db < database/schema.sql

# Export database
mysqldump -u root -p code_search_db > backup.sql
```

## ⚙️ Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=code_search_db
DATABASE_PORT=3306

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
sudo service mysql status  # Linux
mysqladmin -u root -p ping  # Check connection

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'root'@'localhost';"
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test database connection via API
curl http://localhost:5000/api/repositories

# Test with invalid data
curl -X POST http://localhost:5000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{"repository_name":"","github_url":"invalid"}'
```

### Frontend Issues
```javascript
// Check API service
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Test API call
fetch('http://localhost:5000/api/repositories')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

## 📊 Validation Rules

### Repository Creation
| Field | Rules | Example |
|-------|-------|---------|
| `repository_name` | Required, min 2 chars | `"React"`, `"Node.js"` |
| `github_url` | Required, valid GitHub URL | `"https://github.com/facebook/react"` |
| `description` | Optional, max 500 chars | `"A JavaScript library for building user interfaces"` |

### GitHub URL Format
- Must start with `https://github.com/`
- Must have owner and repo: `https://github.com/owner/repo`
- Case-sensitive
- No trailing slash

### Search Query
- Minimum 2 characters
- Case-insensitive
- Partial matching on name and description

## 🔒 Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database users
3. **Validate all inputs** on both client and server
4. **Use HTTPS** in production
5. **Limit database user permissions** to necessary operations

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Setup
```bash
# Test API
curl http://localhost:5000/api/health

# Test Frontend
open http://localhost:5173
```

### 4. Add Repository via API
```bash
curl -X POST http://localhost:5000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{
    "repository_name": "Test Repo",
    "github_url": "https://github.com/testuser/testrepo"
  }'
```

## 📞 Support Commands

### Check Server Logs
```bash
# Backend logs (in terminal running npm run dev)
# Look for: Database connected successfully

# Database logs (if enabled)
sudo tail -f /var/log/mysql/error.log
```

### Reset Database
```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE code_search_db; CREATE DATABASE code_search_db;"
mysql -u root -p code_search_db < database/schema.sql
```

### Check Network
```bash
# Check if ports are open
netstat -tulpn | grep :5000  # Backend
netstat -tulpn | grep :5173  # Frontend
netstat -tulpn | grep :3306  # MySQL

# Test connectivity
curl -I http://localhost:5000
curl -I http://localhost:5173
```

---

**Need Help?**
1. Check server logs for error messages
2. Verify database is running: `sudo service mysql status`
3. Check `.env` file configuration
4. Test API directly with curl commands
5. Check browser console for frontend errors