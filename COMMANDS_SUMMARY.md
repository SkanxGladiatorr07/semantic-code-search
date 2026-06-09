# Quick Start Commands - Day 1

## 📦 Installation Commands

### Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Expected packages installed:
# ✓ express@^4.19.2
# ✓ cors@^2.8.5  
# ✓ dotenv@^16.4.5
# ✓ mysql2@^3.9.7
```

### Frontend Setup
```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Expected packages installed:
# ✓ react@^18.2.0
# ✓ react-dom@^18.2.0
# ✓ react-router-dom@^6.22.3
# ✓ axios@^1.6.8
# ✓ vite@^5.2.0
# ✓ @vitejs/plugin-react@^4.2.1
```

## ▶️ Running the Application

### Start Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
```

### Start Frontend Server (Terminal 2)
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

## 🧪 Testing Commands

### Test Backend Health Endpoint
```bash
# Using curl
curl http://localhost:5000/api/health

# Using curl (Windows CMD)
curl http://localhost:5000/api/health

# Using browser
# Open: http://localhost:5000/api/health
```

### Test Detailed Health Endpoint
```bash
curl http://localhost:5000/api/health/detailed
```

## 🌐 Access URLs

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Detailed Health**: http://localhost:5000/api/health/detailed

## 📁 Final Folder Structure

```
semantic-code-search/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── healthController.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   └── healthRoutes.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── Navbar.jsx
│   │   │   └── layout/
│   │   │       └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md
└── COMMANDS_SUMMARY.md
```

## 🔧 Configuration Files

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=code_search_db
DATABASE_PORT=3306
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📝 Suggested Git Commits for Day 1

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit 1: Project initialization
git commit -m "chore: initialize MERN stack project structure"

# Commit 2: Backend setup
git add backend/
git commit -m "feat(backend): add Express server with health check endpoints

- Setup Express server with modular structure
- Add health check routes (/api/health)
- Configure CORS and middleware
- Add error handling and logging utilities
- Prepare database configuration for future use"

# Commit 3: Frontend setup
git add frontend/
git commit -m "feat(frontend): setup React app with Vite

- Initialize React with Vite
- Setup React Router with Home and Dashboard pages
- Add Navbar component with server status indicator
- Configure Axios for API calls
- Add responsive styling with CSS variables"

# Commit 4: Documentation
git add README.md SETUP_GUIDE.md COMMANDS_SUMMARY.md
git commit -m "docs: add comprehensive project documentation

- Add README with project overview and tech stack
- Add detailed setup guide with file explanations
- Add quick start commands summary"

# Create main branch (if needed)
git branch -M main

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/semantic-code-search.git

# Push to GitHub
git push -u origin main
```

## 🎯 What Was Built Today

### Backend ✅
- Express server with ES Modules
- Health check endpoints
- Modular folder structure (config, controllers, routes, middleware, utils)
- CORS configuration
- Environment variable management
- Error handling middleware
- Logging utility
- Graceful shutdown handling

### Frontend ✅
- React app with Vite
- React Router (Home and Dashboard pages)
- Navbar component with server status
- Layout component for consistent structure
- Axios API service
- Professional styling with CSS variables
- Responsive design
- Smooth animations

### Documentation ✅
- Comprehensive README.md
- Detailed SETUP_GUIDE.md
- Quick reference COMMANDS_SUMMARY.md

## 🚫 What Was NOT Built (Future Work)

- ❌ MySQL database schema and connection
- ❌ User authentication
- ❌ GitHub API integration
- ❌ Repository cloning/import
- ❌ Code parsing (Tree-Sitter)
- ❌ Semantic search functionality
- ❌ AI-powered Q&A
- ❌ Code analysis features

## ✅ Verification Checklist

Before moving to Day 2, verify:

- [ ] Backend runs without errors on http://localhost:5000
- [ ] Frontend runs without errors on http://localhost:5173
- [ ] Health check endpoint returns JSON: http://localhost:5000/api/health
- [ ] Navbar shows green "● Online" status
- [ ] Home page displays hero section and features
- [ ] Dashboard shows server status card
- [ ] Navigation between pages works
- [ ] No console errors in browser DevTools
- [ ] No errors in backend terminal
- [ ] All files are properly organized in folders

## 🎓 Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Backend runtime |
| Express.js | ^4.19 | Web framework |
| React | ^18.2 | Frontend library |
| Vite | ^5.2 | Build tool |
| React Router | ^6.22 | Client routing |
| Axios | ^1.6 | HTTP client |
| MySQL2 | ^3.9 | Database driver (prepared) |
| CORS | ^2.8 | Cross-origin requests |
| dotenv | ^16.4 | Environment variables |

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Backend (port 5000)
# On Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173) - similar process
```

### Module Not Found Errors
```bash
# Clear and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Verify backend is running
- Check `CLIENT_URL` in `backend/.env` matches frontend URL
- Ensure CORS middleware is configured in `backend/src/app.js`

### Server Status Shows Offline
- Backend must be running first
- Check console for API errors
- Verify `VITE_API_BASE_URL` in `frontend/.env`

## 📚 Additional Resources

- **Express.js Documentation**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **Vite Guide**: https://vitejs.dev/guide/
- **React Router**: https://reactrouter.com/
- **Axios Documentation**: https://axios-http.com/

## 🎉 Success!

If all checks pass, you have successfully completed Day 1 setup! 

**Your MERN stack foundation is ready for feature development.** 🚀

---

**Next Steps (Day 2):**
1. Design MySQL database schema
2. Create repository management tables
3. Implement basic CRUD operations
4. Add repository import form UI
5. Connect GitHub API for repository metadata

But that's for another day! Take a break and celebrate your progress! 🎊
