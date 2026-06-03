<div align="center">

# 🚨 CivicEye

**A full-stack civic complaint management & resolution platform**

*File complaints online · Track resolution progress · Admin-powered issue management*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io)](https://socket.io/)

</div>

---

## 📖 About

CivicEye is a comprehensive civic complaint management platform designed to streamline the process of reporting, tracking, and resolving public grievances. Citizens can file complaints, track their status in real-time, and receive notifications. Departments manage complaint assignments, and officers handle case resolution. Admins oversee the entire system with comprehensive analytics and user management.

---

## ✨ Features

### 👤 Citizens
- Register and secure login with JWT authentication
- File complaints with location, category, and attachments
- Track complaint status in real-time with live notifications
- Rate and review resolution processes
- View complaint history and resolution details
- Update profile information and preferences
- Receive notifications for status updates
- View complaint timeline with resolution steps

### 🔐 Officers
- View assigned complaints in their jurisdiction
- Update complaint status and add resolution notes
- Track workload and performance metrics
- Real-time notifications for new assignments
- View complaint details with citizen information
- Submit resolution reports with timestamps
- Track department-wide activity

### 🏛️ Admins
- Complete system dashboard with analytics
- User management (citizens, officers, departments)
- Department management and resource allocation
- Monitor complaint resolution metrics
- View system notifications and logs
- Manage officer workload distribution
- Generate performance reports
- Configure system settings

### 🌐 Public
- Landing page with system overview
- Information about complaint categories
- Department directory
- Contact information and support resources
- FAQ section

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TanStack Router, Vite, Tailwind CSS, Radix UI |
| UI Components | Shadcn/ui, Hook Form, Zod validation |
| Backend | Node.js, Express 4.18 |
| Database | MongoDB with Mongoose ODM |
| Real-time | Socket.io 4.8 for live notifications |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Validation | Joi (backend), Zod (frontend) |
| HTTP Client | Axios |
| Logging | Morgan |

---

## 📁 Project Structure

```
CivicEye/
├── backend/                    # Express REST API
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # Citizens, officers, admins
│   │   ├── Complaint.js       # Complaint data model
│   │   ├── Department.js      # Department information
│   │   ├── Notification.js    # User notifications
│   │   ├── Activity.js        # Activity logs
│   │   └── Setting.js         # System settings
│   ├── routes/                 # API endpoints
│   │   ├── auth.js            # Authentication (login/register)
│   │   ├── complaints.js      # Complaint CRUD operations
│   │   ├── departments.js     # Department management
│   │   ├── officers.js        # Officer management
│   │   ├── notifications.js   # Notification endpoints
│   │   ├── location.js        # Location/mapping services
│   │   └── admin.js           # Admin dashboard endpoints
│   ├── validators/             # Input validation
│   │   └── complaintValidator.js
│   ├── data/                   # Mock/seed data
│   ├── db.js                   # MongoDB connection
│   ├── server.js               # Express app setup
│   ├── socket.js               # Socket.io configuration
│   └── seed.js                 # Database seeding script
│
└── frontend/                   # React + Vite app
    ├── src/
    │   ├── api/                # API service clients
    │   │   ├── authService.js
    │   │   ├── complaintService.js
    │   │   ├── departmentService.js
    │   │   ├── officerService.js
    │   │   └── ...
    │   ├── components/         # Reusable components
    │   │   ├── layout/        # App shell, headers, sidebars
    │   │   ├── complaints/    # Complaint-related components
    │   │   ├── admin/         # Admin dashboard components
    │   │   ├── map/           # Location mapping (Leaflet/Mapbox)
    │   │   ├── common/        # Shared components
    │   │   └── ui/            # Shadcn/ui components
    │   ├── pages/              # Page routes
    │   │   ├── admin/         # Admin dashboard pages
    │   │   ├── citizen/       # Citizen portal pages
    │   │   ├── officer/       # Officer portal pages
    │   │   ├── auth/          # Login/signup pages
    │   │   └── Landing.jsx    # Public landing page
    │   ├── context/            # React context
    │   │   ├── AuthContext.jsx
    │   │   └── NotificationContext.jsx
    │   ├── routes/             # TanStack Router configuration
    │   ├── config/             # App configuration
    │   └── styles.css          # Global styles
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/civiceye.git
cd civiceye
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/civiceye

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5003

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Initialize the database (optional - runs seed data):

```bash
npm run seed
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5003`.

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5003
VITE_SOCKET_URL=http://localhost:5003

# Feature Flags (optional)
VITE_ENABLE_MAPS=true
VITE_ENABLE_NOTIFICATIONS=true
```

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Complaints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/complaints` | File new complaint | User |
| GET | `/api/complaints` | Get all complaints | User |
| GET | `/api/complaints/:id` | Get complaint details | User |
| PATCH | `/api/complaints/:id/status` | Update complaint status | Officer |
| PATCH | `/api/complaints/:id` | Update complaint | User |
| DELETE | `/api/complaints/:id` | Delete complaint | Admin |

### Departments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/departments` | Get all departments | — |
| GET | `/api/departments/:id` | Get department details | — |
| POST | `/api/departments` | Create department | Admin |
| PATCH | `/api/departments/:id` | Update department | Admin |

### Officers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/officers` | List all officers | Admin |
| GET | `/api/officers/:id` | Get officer details | — |
| POST | `/api/officers` | Add officer | Admin |
| PATCH | `/api/officers/:id/workload` | Update workload | Admin |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | User |
| PATCH | `/api/notifications/:id/read` | Mark as read | User |
| DELETE | `/api/notifications/:id` | Delete notification | User |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Dashboard metrics | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/reports` | System reports | Admin |

---

## 📸 Pages Overview

| Route | Role | Description |
|-------|------|-------------|
| `/` | Public | Landing page with system info |
| `/auth/login` | Public | Login page |
| `/auth/signup` | Public | Registration page |
| `/citizen/complaints` | Citizen | Browse own complaints |
| `/citizen/complaint/new` | Citizen | File new complaint |
| `/citizen/complaint/:id` | Citizen | View complaint details |
| `/citizen/notifications` | Citizen | View notifications |
| `/citizen/profile` | Citizen | User profile settings |
| `/officer/dashboard` | Officer | Officer dashboard |
| `/officer/complaints` | Officer | Assigned complaints |
| `/officer/complaint/:id` | Officer | Handle complaint |
| `/officer/workload` | Officer | View workload metrics |
| `/admin/dashboard` | Admin | Admin dashboard |
| `/admin/users` | Admin | Manage users |
| `/admin/departments` | Admin | Manage departments |
| `/admin/reports` | Admin | System reports |

---

## 🔐 Authentication & Authorization

CivicEye uses **JWT (JSON Web Tokens)** for secure authentication:

- **Tokens** are issued upon login and sent with each API request in the `Authorization: Bearer <token>` header
- **Roles**: `citizen`, `officer`, `admin`
- **Protected routes** are enforced on both frontend and backend
- **Passwords** are hashed using bcryptjs before storage

---

## 🌍 Deployment

### Frontend → [Vercel](https://vercel.com)

1. Connect your GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variables:
   - `VITE_API_URL` = your deployed backend URL
   - `VITE_SOCKET_URL` = your backend WebSocket URL
4. Click **Deploy**

### Backend → [Railway](https://railway.app), [Render](https://render.com), or [Heroku](https://heroku.com)

**Example for Railway:**

1. Connect the GitHub repo
2. Set **Root Directory** to `backend`
3. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong secret key
   - `PORT` = 5003 (or your preferred port)
   - `CORS_ORIGIN` = your frontend deployment URL
4. Deploy

### Database → [MongoDB Atlas](https://cloud.mongodb.com)

1. Create a free M0 cluster
2. Generate a connection string with your username/password
3. Add `0.0.0.0/0` to Network Access (or your server's IP)
4. Use the connection string as your `MONGO_URI`

---

## 📊 Real-time Features

CivicEye uses **Socket.io** for real-time updates:

- **Live notifications** when complaint status changes
- **Real-time officer dashboard** updates
- **Instant messaging** within complaint discussions
- **Activity streams** for admins

To enable Socket.io:

1. Ensure the backend is running on the specified port
2. Set `VITE_SOCKET_URL` in frontend `.env`
3. WebSocket connections are automatically established on app load

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📝 Environment Variables Reference

### Backend (.env)

```env
# Required
MONGO_URI=mongodb://localhost:27017/civiceye
JWT_SECRET=your_secure_secret_key_here
PORT=5003
CORS_ORIGIN=http://localhost:5173

# Optional
NODE_ENV=development
LOG_LEVEL=debug
```

### Frontend (.env)

```env
# Required
VITE_API_URL=http://localhost:5003
VITE_SOCKET_URL=http://localhost:5003

# Optional
VITE_ENABLE_MAPS=true
VITE_ENABLE_NOTIFICATIONS=true
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod`
- Verify `JWT_SECRET` is set in `.env`
- Ensure port 5003 is not in use

### Frontend build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `npm run build` with `--force` flag

### Socket.io connection issues
- Ensure `VITE_SOCKET_URL` matches your backend URL
- Check CORS settings in `backend/server.js`
- Verify firewall allows WebSocket connections

### Database connection errors
- Test MongoDB connection string with `mongosh`
- Check IP whitelist in MongoDB Atlas
- Verify credentials in connection string

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**CivicEye Development Team**

---

<div align="center">

Made with 🚀 to improve civic governance

For questions or support, please open an [issue](https://github.com/yourusername/civiceye/issues)

</div>
