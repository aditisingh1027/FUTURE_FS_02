# ClientPilot

**ClientPilot** is a full-stack Lead Management and CRM application designed to help freelancers, agencies, and small businesses efficiently manage client inquiries generated through websites, referrals, and marketing channels.

The platform provides a centralized workspace for tracking prospects, managing follow-ups, recording client interactions, and monitoring lead conversion progress through a structured sales pipeline. The project was built to simulate a real-world business workflow while demonstrating modern full-stack development practices.

---

## Problem Statement

Businesses often receive inquiries from multiple sources such as website contact forms, social media campaigns, referrals, and email outreach. Managing these leads manually through spreadsheets or emails can result in missed follow-ups, inconsistent tracking, and lost business opportunities.

ClientPilot addresses this problem by providing a streamlined CRM system that enables users to:

* Organize incoming leads in a centralized database
* Track lead progression through different pipeline stages
* Maintain conversation history and follow-up records
* Monitor lead sources and conversion performance
* Improve visibility into ongoing sales activities

---

## Key Features

### Authentication & Security

* JWT-based authentication
* Secure password hashing using bcrypt
* Role-based access control (Admin, Manager, Sales)
* Protected API routes
* Security middleware including Helmet and Rate Limiting

### Lead Management

* Create, update, and delete leads
* Lead source tracking
* Pipeline stage management
* Lead ownership assignment
* Follow-up scheduling

### Conversation Tracking

* Maintain interaction history for every lead
* Timestamped notes and updates
* Activity timeline for auditability

### Analytics Dashboard

* Total prospects overview
* Conversion metrics
* Lead source distribution
* Pipeline stage breakdown
* Upcoming follow-up tracking

### Search & Filtering

* Search by lead name or email
* Filter by status and source
* Server-side query handling for scalability

### User Experience

* Responsive design across desktop, tablet, and mobile devices
* Consistent UI components
* Loading, error, and empty states
* Intuitive navigation and dashboard layout

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS v4
* React Router DOM
* Axios
* React Hot Toast
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Helmet
* express-rate-limit
* express-validator

---
## Setup Instructions

### Prerequisites

Before running the project, ensure the following are installed:

* Node.js (v18 or later)
* npm (comes with Node.js)
* MongoDB Atlas account or local MongoDB installation
* Git

---

### Clone the Repository

```bash
git clone https://github.com/aditisingh1027/FUTURE_FS_02.git
cd FUTURE_FS_02
```

---

### Install Dependencies

Install dependencies for both frontend and backend:

```bash
npm run install-all
```

Alternatively:

```bash
cd client
npm install

cd ../server
npm install
```

---

### Configure Environment Variables

#### Backend

Create a `.env` file inside the `server` folder:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=30d
```

#### Frontend

Create a `.env` file inside the `client` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Run the Application

From the project root:

```bash
npm run dev
```

Or run frontend and backend separately:

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

### Access the Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

---

### Build for Production

Frontend:

```bash
npm --prefix client run build
```

Backend:

```bash
npm --prefix server run start
```

## System Architecture

ClientPilot follows a modular MERN architecture with clear separation of concerns.

```text
Client (React)
      │
      ▼
REST API (Express)
      │
      ▼
Business Logic Layer
      │
      ▼
MongoDB Database
```

The application is structured using reusable components, controllers, middleware, and service-oriented patterns to improve maintainability and scalability.

---

## Database Design

### Users

Stores application users and their access roles.

### Leads

Stores prospect information including:

* Contact details
* Lead source
* Pipeline stage
* Follow-up schedules
* Notes and interactions

### Activities

Stores system-generated activity logs for lead tracking and auditing purposes.

---

## Learning Outcomes

Through this project, I gained hands-on experience with:

* Full-stack application development using the MERN stack
* Authentication and authorization workflows
* REST API design and implementation
* Database modeling with MongoDB
* Secure application development practices
* Business workflow automation
* State management and frontend architecture
* Deployment and production readiness

---

## Local Setup

### Install Dependencies

```bash
npm run install-all
```

### Configure Environment Variables

Server:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRE=30d
```

Client:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run Development Environment

```bash
npm run dev
```

---

## Future Enhancements

* Email notification integration
* Automated follow-up reminders
* Lead assignment workflows
* Advanced reporting and analytics
* Export functionality (CSV/PDF)
* Calendar integration
* Real-time notifications

---

## Author

## Author

Developed by **Aditi Kumari Singh** as part of the Full Stack Development Internship Program at Future Interns.

This project focuses on building a real-world lead management system that demonstrates full-stack application development, secure authentication, database management, API integration, and modern frontend engineering using the MERN stack.
