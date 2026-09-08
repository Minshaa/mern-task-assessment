# Task Manager App - MERN

A complete MERN stack Task Manager built for the internship assessment.

## Features

- User signup/login with JWT authentication
- Password hashing with bcrypt
- Create, read, update and delete tasks
- Mark tasks as pending/completed
- Tasks are private to the logged-in user
- Filter: All / Pending / Completed
- Search by task title
- Priority and due date
- Completed percentage progress bar
- Responsive UI
- Dark/light mode
- API validation and error handling

## Project Structure

```text
task-manager-mern/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── controllers/taskController.js
│   ├── middleware/authMiddleware.js
│   ├── middleware/errorMiddleware.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── routes/authRoutes.js
│   ├── routes/taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/Navbar.jsx
│   │   ├── components/ProtectedRoute.jsx
│   │   ├── components/TaskForm.jsx
│   │   ├── components/TaskItem.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/Login.jsx
│   │   ├── pages/Register.jsx
│   │   ├── pages/Dashboard.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Backend setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Start backend:

```bash
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

All task endpoints require:

```text
Authorization: Bearer <JWT>
```

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle`

## Deployment

The assessment mentions optional deployment using Vercel for the frontend and Render for the backend. Set the production environment variables on the respective platforms before deploying.
