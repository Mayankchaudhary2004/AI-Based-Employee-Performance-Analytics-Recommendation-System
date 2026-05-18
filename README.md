# AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application for AI-powered HR performance management.

## Tech Stack
- **Frontend**: React.js, React Router, Axios, Recharts, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI**: OpenRouter API (GPT-3.5-turbo)
- **Auth**: JWT + bcryptjs

## Features
- ✅ Employee CRUD (Add, View, Update, Delete)
- ✅ Search & Filter by department, name, skill, score
- ✅ AI Recommendations (promotion, training, feedback)
- ✅ Performance Rankings & Leaderboard
- ✅ Analytics Dashboard with Charts
- ✅ JWT Authentication & Protected Routes

## Project Structure
```
Employee Performance Analytics/
├── backend/
│   ├── controllers/   # authController, employeeController, aiController
│   ├── middleware/    # authMiddleware, validationMiddleware
│   ├── models/        # User.js, Employee.js
│   ├── routes/        # authRoutes, employeeRoutes, aiRoutes
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── api/       # api.js (Axios client)
        ├── components/# Navbar, ProtectedRoute
        ├── context/   # AuthContext
        └── pages/     # Login, Signup, Dashboard, EmployeeList, AddEmployee, Rankings, AIRecommend
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login & get JWT |
| GET | /api/auth/me | Get profile (protected) |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/employees | Add employee |
| GET | /api/employees | Get all employees |
| GET | /api/employees/search | Search/filter employees |
| GET | /api/employees/:id | Get employee by ID |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/recommend | AI recommendation |
| GET | /api/ai/rankings | Get employee rankings |

## Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

## Deployment (Render)
- **Backend**: Web Service — `cd backend && npm install && npm start`
- **Frontend**: Static Site — `cd frontend && npm install && npm run build`, publish `frontend/build`

## GitHub Repository
https://github.com/Mayankchaudhary2004/AI-Based-Employee-Performance-Analytics-Recommendation-System
