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
- `GET /api/health/detailed` - Detailed system information

### Repository Management
- `GET /api/repositories` - Get all repositories
- `GET /api/repositories/:id` - Get single repository by ID
- `POST /api/repositories` - Create new repository
- `PUT /api/repositories/:id` - Update repository
- `DELETE /api/repositories/:id` - Delete repository
- `GET /api/repositories/search?q=:query` - Search repositories

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

## 🔄 Day 2 Updates - Database Integration

### 🗃️ Database Schema

**Repositories Table:**
```sql
CREATE TABLE repositories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repository_name VARCHAR(255) NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_github_url (github_url),
    CHECK (github_url LIKE 'https://github.com/%/%')
);
```

### 📁 New Files Created

**Backend:**
- `src/models/RepositoryModel.js` - Database operations for repositories
- `src/controllers/repositoryController.js` - Repository CRUD logic
- `src/routes/repositoryRoutes.js` - Repository API endpoints
- `src/middleware/validators.js` - Request validation middleware
- `database/schema.sql` - Complete SQL schema with sample data

**Frontend:**
- `src/pages/Repositories.jsx` - Repository management page
- `src/components/repositories/RepositoryForm.jsx` - Form for adding/editing repositories
- `src/components/repositories/RepositoryList.jsx` - List and search repositories
- Updates to `src/services/api.js` - New repository API functions

### 🛠️ Features Implemented

✅ **Database Integration**
- MySQL connection pool with automatic table creation
- Environment variable configuration
- Error handling and connection management
- Sample data insertion

✅ **Repository Management API**
- Full CRUD operations (Create, Read, Update, Delete)
- Input validation and sanitization
- Search functionality
- Proper HTTP status codes and error messages
- Request validation middleware

✅ **Frontend Components**
- Repository list with search and filtering
- Add/Edit repository form with validation
- Responsive design with modern UI
- Integration with backend API
- Error handling and loading states

✅ **Updated Navigation**
- New "Repositories" page in navbar
- Updated dashboard with repository management card
- Improved user flow

### 🔧 Database Setup Commands

1. **Create Database:**
```sql
CREATE DATABASE code_search_db;
```

2. **Run Schema:**
```bash
mysql -u root -p code_search_db < database/schema.sql
```

3. **Or use auto-creation:**
   The server automatically creates tables if they don't exist

### 📊 Environment Variables Updated

**Backend (.env):**
```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=code_search_db
DATABASE_PORT=3306
```

### 🧪 Testing Repository API

```bash
# Get all repositories
curl http://localhost:5000/api/repositories

# Create repository
curl -X POST http://localhost:5000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{
    "repository_name": "React",
    "github_url": "https://github.com/facebook/react",
    "description": "A JavaScript library for building user interfaces"
  }'

# Search repositories
curl "http://localhost:5000/api/repositories/search?q=react"
```

### 🎯 Clean Code Practices

✅ **Backend Architecture**
- Model-Controller-Routes separation
- Middleware for validation and error handling
- Reusable database connection pool
- Async/await with proper error handling
- Input sanitization and validation

✅ **Frontend Architecture**
- Component-based architecture
- Reusable API service layer
- Form validation with user feedback
- Loading states and error handling
- Responsive CSS with variables

✅ **Database Design**
- Proper indexing for performance
- Data validation at database level
- Automatic timestamps
- Unique constraints to prevent duplicates

### 🔒 Security Features

✅ **Input Validation**
- GitHub URL format validation
- Required field validation
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)

✅ **Error Handling**
- Proper HTTP status codes
- User-friendly error messages
- Server-side validation
- Client-side form validation

### 📱 User Interface Features

✅ **Repository Form**
- Real-time validation
- Character count for description
- GitHub URL preview
- Loading states with spinners
- Success/error feedback

✅ **Repository List**
- Search functionality
- Responsive grid layout
- Edit/Delete actions
- Repository statistics
- Empty state handling

### 🚀 Performance Optimizations

✅ **Database**
- Connection pooling
- Proper indexing
- Efficient queries
- Cursor-based pagination (prepared for future)

✅ **Frontend**
- Lazy loading components
- Efficient API calls
- Debounced search
- Optimistic UI updates

### 🔄 Development Workflow

1. **Backend Development:**
```bash
cd backend
npm run dev
```

2. **Frontend Development:**
```bash
cd frontend
npm run dev
```

3. **Database Management:**
```bash
# Access MySQL
mysql -u root -p

# Use database
USE code_search_db;

# View tables
SHOW TABLES;
DESCRIBE repositories;
SELECT * FROM repositories;
```

### 📝 Git Commit Structure for Day 2

```bash
# Database schema and models
git add database/ backend/src/models/ backend/src/config/database.js
git commit -m "feat: add MySQL database schema and repository model"

# API endpoints and controllers
git add backend/src/controllers/repositoryController.js backend/src/routes/repositoryRoutes.js
git commit -m "feat: implement repository CRUD API with validation"

# Frontend components
git add frontend/src/pages/Repositories.jsx frontend/src/components/repositories/
git commit -m "feat: add repository management UI with form and list"

# API service updates
git add frontend/src/services/api.js
git commit -m "feat: update API service with repository endpoints"

# Documentation
git add README.md
git commit -m "docs: update README with Day 2 features and API documentation"

# Navigation and updates
git add frontend/src/App.jsx frontend/src/components/common/Navbar.jsx frontend/src/pages/Dashboard.jsx
git commit -m "feat: update navigation and dashboard with repository links"
```

### 🎉 Day 2 Completion Checklist

- [x] MySQL database setup with automatic table creation
- [x] Repository CRUD API with full validation
- [x] Frontend repository management interface
- [x] Search functionality for repositories
- [x] Form validation and error handling
- [x] Responsive design and modern UI
- [x] Updated navigation and user flow
- [x] Comprehensive documentation

### 🚀 Next Steps (Future Days)

1. **Day 3**: GitHub API integration for repository metadata
2. **Day 4**: File tree visualization for repositories
3. **Day 5**: Code search functionality
4. **Day 6**: User authentication and authorization
5. **Day 7**: Advanced search filters and analytics
6. **Day 8**: Code analysis and insights
7. **Day 9**: Export functionality
8. **Day 10**: Performance optimization and deployment

---

**Day 2 Complete!** 🎉 You now have a fully functional repository management system with database integration. The foundation is ready for adding advanced features in the coming days.