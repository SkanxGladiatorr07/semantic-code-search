# Day 2 - Complete Command List

## 📋 **Installation Commands**

### **1. Install Backend Dependencies**
```bash
cd backend
npm install
```

**Installs:**
- mysql2@^3.9.7 (updated dependency)
- Other dependencies already installed

### **2. Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**Already installed:**
- react@^18.2.0
- react-dom@^18.2.0
- react-router-dom@^6.22.3
- axios@^1.6.8
- vite@^5.2.0

### **3. Database Setup Options**

#### **Option A: Manual Setup**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE code_search_db;"

# Import schema (from project root)
mysql -u root -p code_search_db < database/schema.sql
```

#### **Option B: Auto Setup (Recommended)**
The server automatically creates tables when first started!

## 🚀 **Running Commands**

### **1. Start Backend Server**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🔌 Initializing database connection...
✅ Database connected successfully
✅ repositories table exists (or created)
✅ Sample data inserted
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
🗃️  Database: code_search_db
👤 Database user: root
```

### **2. Start Frontend Server**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.2.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🧪 **Testing Commands**

### **1. Test Database Connection**
```bash
# Direct MySQL access
mysql -u root -p code_search_db -e "SELECT * FROM repositories;"
```

### **2. Test API Endpoints**

#### **Health Check**
```bash
curl http://localhost:5000/api/health
```

#### **Get All Repositories**
```bash
curl http://localhost:5000/api/repositories
```

#### **Create Repository**
```bash
curl -X POST http://localhost:5000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{
    "repository_name": "Next.js",
    "github_url": "https://github.com/vercel/next.js",
    "description": "The React Framework for the Web"
  }'
```

#### **Search Repositories**
```bash
curl "http://localhost:5000/api/repositories/search?q=react"
```

#### **Get Single Repository**
```bash
curl http://localhost:5000/api/repositories/1
```

#### **Update Repository**
```bash
curl -X PUT http://localhost:5000/api/repositories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

#### **Delete Repository**
```bash
curl -X DELETE http://localhost:5000/api/repositories/1
```

### **3. Test Frontend**
```bash
# Open in browser
open http://localhost:5173  # Mac
start http://localhost:5173  # Windows
xdg-open http://localhost:5173  # Linux
```

## 📁 **File Generation Commands**

### **Files Created Today (32 new files)**

#### **Database Files (1)**
- `database/schema.sql` - Complete SQL schema

#### **Backend Files (5)**
- `backend/src/models/RepositoryModel.js` - Database model
- `backend/src/controllers/repositoryController.js` - Controller
- `backend/src/routes/repositoryRoutes.js` - Routes
- `backend/src/middleware/validators.js` - Validation middleware
- Updated: `backend/src/config/database.js` - Auto-table creation
- Updated: `backend/server.js` - Database initialization

#### **Frontend Files (3 new, 3 updated)**
- `frontend/src/pages/Repositories.jsx` - New page
- `frontend/src/components/repositories/RepositoryForm.jsx` - Form component
- `frontend/src/components/repositories/RepositoryList.jsx` - List component
- Updated: `frontend/src/App.jsx` - Added route
- Updated: `frontend/src/components/common/Navbar.jsx` - Added link
- Updated: `frontend/src/services/api.js` - Added API functions
- Updated: `frontend/src/pages/Dashboard.jsx` - Updated card
- Updated: `frontend/src/styles/App.css` - Added styles

#### **Documentation Files (3)**
- Updated: `README.md` - Day 2 updates
- `DAY2_SUMMARY.md` - Comprehensive summary
- `database/QUICK_REFERENCE.md` - Quick reference
- `DAY2_COMMANDS.md` - This file

## 🔧 **Environment Setup Commands**

### **Backend Environment**
```bash
cd backend
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=code_search_db
DATABASE_PORT=3306
CLIENT_URL=http://localhost:5173
EOF
```

### **Frontend Environment**
```bash
cd frontend
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:5000/api
EOF
```

## 🐛 **Troubleshooting Commands**

### **1. Database Issues**
```bash
# Check if MySQL is running
sudo service mysql status  # Linux/Mac
net start MySQL  # Windows (as admin)

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check table structure
mysql -u root -p code_search_db -e "DESCRIBE repositories;"

# Check sample data
mysql -u root -p code_search_db -e "SELECT * FROM repositories;"
```

### **2. Port Conflicts**
```bash
# Check port 5000 (backend)
netstat -tulpn | grep :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Check port 5173 (frontend)
netstat -tulpn | grep :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows

# Kill process on port (Linux/Mac)
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port (Windows)
# Find PID: netstat -ano | findstr :5000
# taskkill /PID <PID> /F
```

### **3. Node.js Issues**
```bash
# Check Node.js version
node --version  # Should be 16+

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **4. API Testing**
```bash
# Test if server is running
curl -I http://localhost:5000

# Test health endpoint
curl http://localhost:5000/api/health

# Test with verbose output
curl -v http://localhost:5000/api/repositories
```

## 📝 **Git Commands for Day 2**

### **Recommended Commit Structure**
```bash
# Stage all changes
git add .

# Commit database changes
git commit -m "feat(database): add MySQL schema and auto-table creation
- Create repositories table with proper constraints
- Add sample data for testing
- Implement automatic table verification and creation"

# Commit backend API
git commit -m "feat(backend): implement repository CRUD API
- Add RepositoryModel with database operations
- Create repository controller with validation
- Add repository routes with middleware
- Implement search functionality
- Add request validation middleware"

# Commit frontend components
git commit -m "feat(frontend): add repository management UI
- Create Repositories page with responsive design
- Add RepositoryForm component with validation
- Implement RepositoryList with search and actions
- Update API service with repository endpoints
- Add modern styling and UX improvements"

# Commit navigation updates
git commit -m "feat(navigation): update app structure
- Add Repositories route to main app
- Update Navbar with repositories link
- Enhance Dashboard with repository feature card
- Improve user flow and navigation"

# Commit documentation
git commit -m "docs: update documentation for Day 2
- Update README with API documentation
- Add comprehensive Day 2 summary
- Create quick reference guides
- Add troubleshooting documentation"

# Push to GitHub
git push origin main
```

### **Alternative: Single Commit**
```bash
git add .
git commit -m "feat: Day 2 - Database integration and repository management

Database:
- MySQL schema with auto-table creation
- repositories table with proper constraints
- Sample data for testing

Backend:
- Repository CRUD API with validation
- Model-Controller-Routes architecture
- Search functionality
- Request validation middleware

Frontend:
- Repository management page
- Add/Edit form with validation
- Repository list with search
- Updated navigation and routing
- Modern responsive design

Documentation:
- Updated README with API docs
- Comprehensive Day 2 summary
- Quick reference guides
- Troubleshooting documentation"
```

## 🎯 **Verification Checklist Commands**

### **1. Verify Backend is Running**
```bash
curl -s http://localhost:5000/api/health | grep -q '"success":true' && echo "✅ Backend is healthy" || echo "❌ Backend not responding"
```

### **2. Verify Database Connection**
```bash
curl -s http://localhost:5000/api/repositories | grep -q '"success":true' && echo "✅ Database connected" || echo "❌ Database error"
```

### **3. Verify Frontend is Running**
```bash
# Check if port 5173 is listening
netstat -tulpn 2>/dev/null | grep :5173 && echo "✅ Frontend running" || echo "❌ Frontend not running"
```

### **4. Verify API Endpoints**
```bash
# Test all endpoints
endpoints=(
  "/health"
  "/health/detailed"
  "/repositories"
  "/repositories/search?q=react"
)

for endpoint in "${endpoints[@]}"; do
  if curl -s "http://localhost:5000/api$endpoint" | grep -q '"success":true'; then
    echo "✅ $endpoint - OK"
  else
    echo "❌ $endpoint - Failed"
  fi
done
```

## 🔄 **Reset Commands**

### **Reset Database Only**
```bash
mysql -u root -p -e "DROP DATABASE code_search_db; CREATE DATABASE code_search_db;"
```

### **Reset Everything (Clean Start)**
```bash
# Stop servers (Ctrl+C in terminals)

# Reset database
mysql -u root -p -e "DROP DATABASE code_search_db; CREATE DATABASE code_search_db;"

# Clear node modules (optional)
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json

# Reinstall
cd ../backend && npm install
cd ../frontend && npm install

# Restart servers
cd ../backend && npm run dev &
cd ../frontend && npm run dev &
```

## 📊 **Performance Testing Commands**

### **Test API Response Time**
```bash
time curl -s http://localhost:5000/api/repositories > /dev/null
```

### **Test Database Query**
```bash
time mysql -u root -p code_search_db -e "SELECT * FROM repositories" > /dev/null
```

### **Test Concurrent Requests**
```bash
# Test 10 concurrent requests
for i in {1..10}; do
  curl -s http://localhost:5000/api/health > /dev/null &
done
wait
echo "✅ 10 concurrent requests completed"
```

## 🚀 **Production Preparation Commands**

### **Build Frontend for Production**
```bash
cd frontend
npm run build
```

### **Start Backend in Production Mode**
```bash
cd backend
NODE_ENV=production npm start
```

### **Check Production Build**
```bash
# Serve built files locally
cd frontend/dist
npx serve -s .
```

## 📈 **Monitoring Commands**

### **Check Server Logs**
```bash
# Backend logs (in terminal)
# Or redirect to file:
cd backend
npm run dev 2>&1 | tee backend.log

# Database logs (MySQL)
sudo tail -f /var/log/mysql/error.log
```

### **Check Resource Usage**
```bash
# Check Node.js memory usage
ps aux | grep node

# Check MySQL memory usage
ps aux | grep mysql

# Check disk space
df -h
```

## 🎉 **Celebration Command**
```bash
echo "🎉 Day 2 Complete! You've successfully built:"
echo "✅ MySQL Database Integration"
echo "✅ Repository CRUD API"
echo "✅ Frontend Management Interface"
echo "✅ Search Functionality"
echo "✅ Form Validation"
echo "✅ Responsive Design"
echo ""
echo "🚀 Ready for Day 3: GitHub API Integration!"
```

---

## 📚 **Learning Resources**

### **MySQL Commands Cheat Sheet**
```bash
# Common MySQL commands
mysql -u root -p  # Login
SHOW DATABASES;   # List databases
USE database;     # Switch database
SHOW TABLES;      # List tables
DESCRIBE table;   # Show table structure
SELECT * FROM table;  # Show all data
EXIT;             # Exit MySQL
```

### **CURL Commands Cheat Sheet**
```bash
# Common curl commands
curl http://example.com          # GET request
curl -X POST http://example.com  # POST request
curl -X PUT http://example.com   # PUT request
curl -X DELETE http://example.com # DELETE request
curl -H "Content-Type: application/json" http://example.com  # Add header
curl -d '{"key":"value"}' http://example.com  # Send data
curl -v http://example.com       # Verbose output
```

### **Git Commands Cheat Sheet**
```bash
# Common git commands
git status          # Check status
git add .           # Add all files
git commit -m "msg" # Commit changes
git push            # Push to remote
git pull            # Pull from remote
git log --oneline   # View commit history
git diff            # View changes
```

---

**Remember:** Always test your implementation after each major change. Use the verification checklist to ensure everything is working correctly before moving on to the next feature.

**Happy Coding!** 🚀