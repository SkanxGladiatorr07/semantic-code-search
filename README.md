# Semantic Code Search & Repository Assistant

## 📋 Project Overview

A web application that enables users to import GitHub repositories and perform semantic searches, code analysis, and ask natural language questions about codebases. This project demonstrates full-stack development skills using the MERN stack with MySQL.

## ✨ Features (Roadmap)

- **Repository Management**
  - Import GitHub repositories via URL
  - View repository structure and file tree
  - Browse code files with syntax highlighting

- **Semantic Search**
  - Natural language code search
  - Context-aware results
  - Search across multiple repositories

- **Code Analysis**
  - Repository statistics and metrics
  - Language distribution
  - Code structure visualization

- **AI Assistant**
  - Ask questions about the codebase
  - Get explanations of code functionality
  - Receive suggestions and insights

## 🛠️ Tech Stack

### Frontend
- **React** (via Vite) - UI library for building interactive interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **dotenv** - Environment variable management

### Development Tools
- **Git** - Version control
- **npm** - Package manager

## 📦 Installation Steps

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MySQL (v8 or higher)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=code_search_db
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Folder Structure

```
semantic-code-search/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database configuration
│   │   ├── controllers/
│   │   │   └── healthController.js  # Health check logic
│   │   ├── routes/
│   │   │   ├── index.js             # Main router
│   │   │   └── healthRoutes.js      # Health check routes
│   │   ├── middleware/
│   │   │   └── errorHandler.js      # Error handling middleware
│   │   ├── utils/
│   │   │   └── logger.js            # Logging utility
│   │   └── app.js                   # Express app configuration
│   ├── server.js                    # Server entry point
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── Navbar.jsx       # Navigation bar
│   │   │   └── layout/
│   │   │       └── Layout.jsx       # Main layout wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   └── Dashboard.jsx        # Main dashboard
│   │   ├── services/
│   │   │   └── api.js               # Axios configuration
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

## 🔄 Development Workflow

1. Start the backend server (runs on port 5000)
2. Start the frontend dev server (runs on port 5173)
3. Make changes and see hot-reload in action
4. Commit your changes regularly

## 📝 Future Enhancements

- User authentication and authorization
- GitHub OAuth integration
- Advanced search filters
- Code comparison tools
- Export functionality
- Dark mode support

## 👤 Author

Your Name - Portfolio Project

## 📄 License

This project is for educational purposes.
