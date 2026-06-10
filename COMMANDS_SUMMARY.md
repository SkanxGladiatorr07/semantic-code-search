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
