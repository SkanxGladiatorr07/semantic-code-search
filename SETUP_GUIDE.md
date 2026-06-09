# Day 1 Setup Guide - Semantic Code Search

## 📋 Project Structure Overview

This document explains every folder and file created for the project foundation.

## 🗂️ Complete Folder Structure

```
semantic-code-search/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MySQL connection configuration (prepared for future use)
│   │   ├── controllers/
│   │   │   └── healthController.js  # Business logic for health check endpoints
│   │   ├── routes/
│   │   │   ├── index.js             # Main router that combines all route modules
│   │   │   └── healthRoutes.js      # Health check route definitions
│   │   ├── middleware/
│   │   │   └── errorHandler.js      # Centralized error handling middleware
│   │   ├── utils/
│   │   │   └── logger.js            # Logging utility for consistent log formatting
│   │   └── app.js                   # Express app configuration and middleware setup
│   ├── server.js                    # Server entry point with graceful shutdown
│   ├── .env                         # Environment variables (not committed to Git)
│   ├── .gitignore                   # Git ignore rules for backend
│   └── package.json                 # Backend dependencies and scripts
├── frontend/
│   ├── public/                      # Static assets (Vite default)
│   ├── src/
│   │   ├── assets/                  # Images, fonts, and other media files
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── Navbar.jsx       # Navigation bar component with server status
│   │   │   └── layout/
│   │   │       └── Layout.jsx       # Main layout wrapper with navbar and footer
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero section and features
│   │   │   └── Dashboard.jsx        # Main dashboard with server status check
│   │   ├── services/
│   │   │   └── api.js               # Axios configuration and API service functions
│   │   ├── styles/
│   │   │   ├── App.css              # Component-specific styles
│   │   │   └── index.css            # Global styles and CSS variables
│   │   ├── App.jsx                  # Main app component with React Router
│   │   └── main.jsx                 # React application entry point
│   ├── .env                         # Frontend environment variables
│   ├── .gitignore                   # Git ignore rules for frontend
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite configuration with proxy setup
│   └── package.json                 # Frontend dependencies and scripts
├── README.md                        # Project documentation
└── SETUP_GUIDE.md                   # This file - detailed setup instructions
```

## 📄 File-by-File Explanation

### Backend Files

#### `backend/server.js`
- **Purpose**: Entry point for the backend server
- **Responsibilities**:
  - Loads environment variables
  - Starts the Express server
  - Handles graceful shutdown on SIGTERM/SIGINT
  - Catches unhandled promise rejections

#### `backend/src/app.js`
- **Purpose**: Express application configuration
- **Responsibilities**:
  - Sets up middleware (CORS, JSON parsing, URL encoding)
  - Configures routes
  - Implements error handling
  - Provides request logging in development mode

#### `backend/src/config/database.js`
- **Purpose**: Database connection management
- **Responsibilities**:
  - MySQL connection pool configuration
  - Connection initialization and testing
  - Pool getter for other modules
  - Graceful connection closure
- **Note**: Prepared for future use but not actively connected yet

#### `backend/src/controllers/healthController.js`
- **Purpose**: Business logic for health check endpoints
- **Contains**:
  - `getHealthStatus()`: Basic health check with uptime
  - `getDetailedHealth()`: Detailed system information (memory, CPU, Node version)

#### `backend/src/routes/healthRoutes.js`
- **Purpose**: Route definitions for health checks
- **Endpoints**:
  - `GET /api/health`: Basic health status
  - `GET /api/health/detailed`: Detailed system info

#### `backend/src/routes/index.js`
- **Purpose**: Main router that combines all route modules
- **Current Routes**: `/health`
- **Future Routes**: Comments indicate where to add repository, search, and auth routes

#### `backend/src/middleware/errorHandler.js`
- **Purpose**: Centralized error handling
- **Features**:
  - Logs errors with stack traces (development only)
  - Sends consistent error responses
  - Custom `AppError` class for operational errors

#### `backend/src/utils/logger.js`
- **Purpose**: Logging utility functions
- **Functions**: `info()`, `error()`, `warn()`, `success()`, `debug()`
- **Features**: Colored output, timestamps, metadata support

#### `backend/package.json`
- **Dependencies**:
  - `express`: Web framework
  - `cors`: Cross-origin resource sharing
  - `dotenv`: Environment variable management
  - `mysql2`: MySQL client with promise support
- **Scripts**:
  - `npm run dev`: Development with auto-reload (Node 18+)
  - `npm start`: Production server

#### `backend/.env`
- **Contains**: Configuration variables (port, database credentials, CORS settings)
- **Security**: Never commit this file to Git

### Frontend Files

#### `frontend/src/main.jsx`
- **Purpose**: React application entry point
- **Responsibilities**:
  - Renders the root component
  - Wraps app in React.StrictMode

#### `frontend/src/App.jsx`
- **Purpose**: Main application component
- **Responsibilities**:
  - Configures React Router
  - Defines route structure
  - Wraps routes in Layout component

#### `frontend/src/components/layout/Layout.jsx`
- **Purpose**: Consistent layout structure
- **Contains**: Navbar, main content area, footer
- **Used**: Wraps all pages for consistent UI

#### `frontend/src/components/common/Navbar.jsx`
- **Purpose**: Navigation bar component
- **Features**:
  - Navigation links (Home, Dashboard)
  - Server status indicator
  - Active route highlighting
  - Auto-refresh server status every 30 seconds

#### `frontend/src/pages/Home.jsx`
- **Purpose**: Landing page
- **Sections**:
  - Hero section with CTA button
  - Features grid (4 feature cards)
  - Tech stack badges

#### `frontend/src/pages/Dashboard.jsx`
- **Purpose**: Main workspace page
- **Features**:
  - Server health status card
  - Placeholder cards for future features
  - Error handling with helpful messages

#### `frontend/src/services/api.js`
- **Purpose**: API service with Axios
- **Features**:
  - Axios instance with base URL and timeout
  - Request/response interceptors for logging
  - Health check functions
  - Prepared for future API endpoints

#### `frontend/src/styles/index.css`
- **Purpose**: Global styles and CSS reset
- **Contains**:
  - CSS custom properties (variables)
  - Base styles for HTML elements
  - Utility classes

#### `frontend/src/styles/App.css`
- **Purpose**: Component-specific styles
- **Contains**:
  - Navbar styles
  - Home page styles
  - Dashboard styles
  - Animations and responsive design

#### `frontend/vite.config.js`
- **Purpose**: Vite build tool configuration
- **Features**:
  - React plugin
  - Dev server on port 5173
  - Proxy for API requests to avoid CORS issues

#### `frontend/package.json`
- **Dependencies**:
  - `react` & `react-dom`: React library
  - `react-router-dom`: Client-side routing
  - `axios`: HTTP client
  - `vite`: Build tool
  - `@vitejs/plugin-react`: Vite React plugin
- **Scripts**:
  - `npm run dev`: Development server
  - `npm run build`: Production build
  - `npm run preview`: Preview production build

## 🚀 Installation Commands

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- express (^4.19.2)
- cors (^2.8.5)
- dotenv (^16.4.5)
- mysql2 (^3.9.7)

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs:
- react (^18.2.0)
- react-dom (^18.2.0)
- react-router-dom (^6.22.3)
- axios (^1.6.8)
- vite (^5.2.0)
- @vitejs/plugin-react (^4.2.1)

## ▶️ Running the Application

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
```

**Test the API:**
```bash
# Open browser or use curl
curl http://localhost:5000/api/health
```

### Terminal 2 - Frontend Server

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

**Access the Application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 🧪 Testing the Setup

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "uptime": 123.456,
  "environment": "development",
  "service": "semantic-code-search-api"
}
```

### 2. Check Frontend
- Navigate to http://localhost:5173
- Should see the landing page with hero section
- Navbar should show "● Online" status indicator
- Click "Dashboard" link
- Dashboard should display server status card with green checkmark

## 🎯 Key Features Implemented

### Backend
✅ Express server with modular structure
✅ Health check endpoints
✅ CORS configuration
✅ Environment variable management
✅ Error handling middleware
✅ Request logging (development)
✅ Graceful shutdown handling

### Frontend
✅ React with Vite
✅ React Router with 2 pages
✅ Responsive Navbar with server status
✅ Home page with hero and features
✅ Dashboard with API integration
✅ Axios API service
✅ Professional styling with CSS variables
✅ Smooth animations

## 🔧 Configuration Details

### Environment Variables

**Backend (.env)**
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

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📝 Git Commit Messages for Day 1

```bash
# Initial commit
git init
git add .
git commit -m "chore: initialize project structure with MERN stack"

# Backend setup
git add backend/
git commit -m "feat(backend): setup Express server with health check endpoints"

# Frontend setup
git add frontend/
git commit -m "feat(frontend): setup React app with routing and basic pages"

# Documentation
git add README.md SETUP_GUIDE.md
git commit -m "docs: add comprehensive project documentation"
```

## 🎓 Clean Coding Practices Applied

1. **ES Modules**: Using `import/export` instead of `require`
2. **Separation of Concerns**: Controllers, routes, and middleware are separate
3. **Environment Variables**: Sensitive config in `.env` files
4. **Error Handling**: Centralized error middleware
5. **Code Comments**: Descriptive comments explaining purpose
6. **Consistent Naming**: camelCase for functions, PascalCase for components
7. **Modular Structure**: Features organized in logical folders
8. **DRY Principle**: Reusable Layout component
9. **API Abstraction**: Centralized API service with Axios
10. **Responsive Design**: Mobile-friendly CSS

## 🔍 Folder Purpose Summary

| Folder/File | Purpose |
|-------------|---------|
| `backend/src/config/` | Configuration files (database, etc.) |
| `backend/src/controllers/` | Business logic handlers |
| `backend/src/routes/` | API route definitions |
| `backend/src/middleware/` | Express middleware functions |
| `backend/src/utils/` | Helper utilities (logging, etc.) |
| `frontend/src/components/common/` | Reusable UI components |
| `frontend/src/components/layout/` | Layout wrapper components |
| `frontend/src/pages/` | Page components for routes |
| `frontend/src/services/` | API integration and external services |
| `frontend/src/styles/` | CSS stylesheets |
| `frontend/src/assets/` | Static assets (images, fonts) |

## ✅ What's Next? (Not for Day 1)

The following features are prepared but NOT implemented yet:
- MySQL database connection and schema
- User authentication
- GitHub repository import
- Repository file tree display
- Code search functionality
- AI-powered code analysis
- Question answering system

## 🆘 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify Node.js version (16+)
- Run `npm install` in backend folder

### Frontend shows offline status
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/src/app.js`
- Verify `.env` files are configured correctly

### CORS errors
- Backend should allow `http://localhost:5173` origin
- Check `CLIENT_URL` in `backend/.env`
- Verify CORS middleware in `backend/src/app.js`

## 🎉 Success Criteria

You'll know the setup is successful when:
1. Backend server starts without errors
2. Frontend dev server opens in browser
3. Navbar shows green "● Online" status
4. Dashboard displays server health information
5. Navigation between Home and Dashboard works smoothly
6. No console errors in browser or terminal

---

**Day 1 Complete!** 🚀 You now have a solid MERN stack foundation ready for feature development.
