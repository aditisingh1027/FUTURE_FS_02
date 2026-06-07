# ClientPilot — Lead Management CRM

**ClientPilot** is a full-stack CRM application built to help freelancers, agencies, and small businesses manage client leads from first contact through to conversion. It provides a centralized workspace for tracking prospects, logging follow-ups, recording interactions, and monitoring pipeline performance.

> "I built this system to manage real clients."

---

## Live Demo

| Layer | URL |
|---|---|
| Frontend (Vercel) | https://future-fs-02-mocha-one.vercel.app |
| Backend API (Render) | https://future-fs-02-km5o.onrender.com/api/health |

**Demo credentials**
```
Email:    aditi@example.com
Password: Aditi@1204
```

---

## Internship Task Checklist

This project was built as Task 2 of the Future Interns Full Stack Development Program.

| Requirement | Status |
|---|---|
| Lead listing — name, email, source, status | ✅ |
| Lead status updates — new / contacted / converted | ✅ |
| Notes and follow-ups for each lead | ✅ |
| Secure admin login (JWT authentication) | ✅ |
| Search leads by name or email | ✅ (bonus) |
| Filter leads by status and source | ✅ (bonus) |
| Timestamp tracking on all records | ✅ (bonus) |
| Analytics — total leads, conversions, conversion rate | ✅ (bonus) |
| Pipeline stage distribution chart | ✅ (bonus) |
| Lead source breakdown chart | ✅ (bonus) |

---

## Key Features

### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Secure password hashing with bcryptjs
- Role-based access control — Admin, Manager, Sales
- Protected API routes via auth middleware
- Helmet security headers and rate limiting

### Lead Management
- Create, view, update, and delete leads
- Track lead source (website, referral, cold call, social media, email)
- Manage pipeline stage — New → Contacted → Qualified → Proposal → Won / Lost
- Assign leads to team members
- Schedule follow-up dates

### Notes & Conversation Tracking
- Add timestamped notes to any lead
- Full activity timeline per lead (creation, notes, status changes)
- Audit trail for every interaction

### Analytics Dashboard
- Total prospects, new prospects, converted leads, conversion rate
- Pipeline stage distribution (donut chart)
- Lead source breakdown (bar chart)
- Follow-up tracking — overdue count, upcoming count, next due

### Search & Filtering
- Real-time search by lead name or email
- Filter by status and source
- Server-side query handling

---

## Technology Stack

### Frontend
| Tool | Purpose |
|---|---|
| React.js | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Recharts | Analytics charts |
| React Hot Toast | Notifications |

### Backend
| Tool | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-validator | Input validation |

---

## System Architecture

```
Browser (React + Vite)
        │  HTTPS requests
        ▼
  Vercel (Static hosting)
        │
        ▼
  Render (Express API)
        │
        ▼
  MongoDB Atlas (Database)
```

**Middleware order in Express:**
```
trust proxy → CORS → Helmet → Rate Limiter → JSON parser → Cookie parser → Routes → Error handler
```

---

## Database Design

### Users
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | unique, required |
| password | String | bcrypt hashed, hidden from queries |
| role | Enum | admin / manager / sales |
| timestamps | Date | createdAt, updatedAt |

### Leads
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | optional |
| phone | String | optional |
| source | Enum | website / referral / cold_call / social_media / email / other |
| status | Enum | new / contacted / qualified / proposal / won / lost |
| notes | Array | embedded timestamped notes |
| followUpDate | Date | scheduled follow-up |
| assignedTo | ObjectId | ref → User |
| timestamps | Date | createdAt, updatedAt |

### Activities
| Field | Type | Notes |
|---|---|---|
| lead | ObjectId | ref → Lead |
| performedBy | ObjectId | ref → User |
| type | Enum | creation / note / status_change / call / email / meeting |
| description | String | required |
| timestamps | Date | createdAt, updatedAt |

---

## API Endpoints

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, sets HTTP-only cookie |
| POST | `/logout` | Private | Clear auth cookie |
| GET | `/me` | Private | Get current user profile |

### Leads — `/api/leads`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Private | List leads (search, filter, paginate) |
| POST | `/` | Private | Create new lead |
| GET | `/:id` | Private | Get single lead |
| PUT | `/:id` | Private | Update lead |
| DELETE | `/:id` | Private | Delete lead |
| POST | `/:id/notes` | Private | Add note to lead |
| GET | `/:id/activities` | Private | Get activity timeline |

### Dashboard — `/api/dashboard`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/stats` | Private | Stats cards (totals, conversion rate) |
| GET | `/charts` | Private | Chart data (by status, by source) |
| GET | `/followups` | Private | Follow-up tracking |

### Health
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server and DB status |

---

## Local Setup

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (free tier works) or local MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/aditisingh1027/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2. Install all dependencies

```bash
npm run install-all
```

### 3. Configure environment variables

**Backend** — create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=30d
```

**Frontend** — create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Seed demo data (optional)

```bash
npm run seed
```

This creates a demo user (`aditi@example.com` / `Aditi@1204`, role: admin) and 19 sample leads with activities.

To clear seeded data:
```bash
npm run seed:clear
```

### 5. Run the application

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## Production Deployment

### Frontend → Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-url.onrender.com/api`

### Backend → Render
- Build command: `npm install`
- Start command: `node server.js`
- Environment variables: same as `server/.env` with `NODE_ENV=production`

---

## Project Structure

```
FUTURE_FS_02/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Route-level page components
│   │   ├── routes/          # Protected route guards
│   │   └── services/        # Axios API service layer
│   ├── vercel.json          # SPA rewrite rules
│   └── vite.config.js       # Build config with production API URL
│
├── server/                  # Express backend
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, error, security, validation
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── services/            # Activity logging service
│   ├── utils/               # JWT token generator
│   └── seed.js              # Demo data seeder
│
└── package.json             # Root scripts (dev, seed, install-all)
```

---

## Learning Outcomes

Through this project I gained hands-on experience with:

- Full-stack MERN application development
- JWT authentication with HTTP-only cookies
- Role-based access control patterns
- REST API design, validation, and error handling
- MongoDB aggregation pipelines for analytics
- Secure deployment across Vercel and Render
- CORS configuration for cross-origin production environments
- Reverse proxy trust configuration (Render + Express)
- React context, hooks, and protected routing

---

## Future Enhancements

- Email notification integration for follow-up reminders
- Lead assignment workflows with notifications
- CSV / PDF export
- Calendar integration for follow-up scheduling
- Real-time updates via WebSockets

---

## Author

Developed by **Aditi Kumari Singh** as part of the Full Stack Development Internship Program at **Future Interns** (Task 2 / 3).
