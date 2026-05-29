# Antigravity CRM

Antigravity CRM is a modern, production-ready MERN stack lead management application built for portfolio showcase and real-world workflow.

## Project Overview

This project includes:
- A polished **React + Vite** frontend with responsive dashboards, lead management, filters, mobile-friendly navigation, and charts.
- A secure **Node.js + Express** backend with **JWT auth**, cookie-based sessions, validation, and role-based access controls.
- A **MongoDB** data layer for leads, users, activity logs, and follow-up scheduling.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4, React Router DOM, Axios, React Hot Toast, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Helmet, express-rate-limit, express-validator

## Key Features

- Secure JWT authentication with HTTP-only cookies
- Role-based access control for `sales`, `manager`, and `admin`
- Mobile-friendly sidebar and dashboard layout
- Lead creation, editing, deletion, notes, and status updates
- Server-side search, status/source filtering, and sorting
- Dashboard analytics with status/source charts and follow-up tracking
- API validation, security headers, and rate limiting

## Repository Structure

```text
FUTURE_FS_02/
├── package.json          # Root scripts for install and dev orchestration
├── README.md             # Project overview and deployment instructions
├── client/               # React/Vite frontend
│   ├── package.json
│   ├── .env.example
│   └── src/
└── server/               # Express backend
    ├── package.json
    ├── .env.example
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

## Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB instance available locally or via MongoDB Atlas

### Install dependencies
From the project root:
```bash
npm run install-all
```

### Environment Variables
Copy the env templates and customize values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

#### `server/.env`
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/antigravity_crm
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

#### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development

Run both the frontend and backend together from the root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Production Build

Build the frontend bundle:

```bash
npm --prefix client run build
```

Start the server:

```bash
npm --prefix server run start
```

## Deployment

### Vercel + Custom Backend
- Deploy the `client/` app to Vercel or any static host.
- Deploy `server/` to Heroku, Railway, Render, or a VPS.
- Set environment variables in the host for `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.

### Full-stack Deployment Checklist
- Set `NODE_ENV=production` on the server
- Use a secure `JWT_SECRET`
- Configure CORS to allow only your frontend origin
- Enable HTTPS for secure cookie transmission
- Use environment-specific values for `MONGO_URI`

## Notes for Portfolio

This repository is structured for a polished developer showcase:
- Clear frontend/backend separation
- Reusable UI components and consistent loading/empty states
- Strong API validation and security middleware
- Easy local setup and deployment guidance

If you want, I can also add a short project demo section with screenshots and feature highlights. 
