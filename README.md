# 🌐 EventSphere — Event Management System

EventSphere is a comprehensive, full-stack event management application designed to handle administrative dashboards, registration tracking, and public event browsing.

Built with a **FastAPI** backend and a **React (Vite)** frontend, it uses **PostgreSQL** for storage and is fully containerized with **Docker**.

---

## ✨ Features

- **Admin Dashboard**: Real-time stats on events and registrations.
- **Event Management**: Create, update, and manage departmental events.
- **Registration Tracking**: Monitor attendee lists and event capacity.
- **Venue Management**: Organize event locations efficiently.
- **Responsive UI**: Sleek, modern design built with Tailwind CSS and Framer Motion.
- **Role-Based Access**: Separate credentials for Superadmins and Departmental Admins.

---

## 🛠️ Project Structure

```bash
Grind/
├── 🚀 backend/         # FastAPI, SQLAlchemy/AsyncPG
├── 🎨 frontend/        # React (Vite), Tailwind CSS
├── 🗄️ db/               # PostgreSQL init scripts
├── 🐳 nginx/            # Reverse proxy configuration
├── 📄 docker-compose.yml # Docker orchestration
└── 📜 DEPLOY.md         # Deployment guide for AWS EC2
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
- [Python 3.12](https://www.python.org/) (optional, for non-docker development).
- [Node.js 20+](https://nodejs.org/) (optional, for non-docker development).

### 1. Setup Environment
Copy the example environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
*(Make sure to update `DB_PASSWORD` and `ADMIN_API_KEY` in `backend/.env`)*

### 2. Launch with Docker
```bash
docker compose up -d --build
```

### 3. Seed Database
Create the initial admin accounts:
```bash
docker exec eventsphere-backend python seed_admin.py
```

---

## ☁️ Deployment

For a detailed walkthrough on how to deploy this application to **AWS EC2**, please refer to the [**DEPLOY.md**](./DEPLOY.md) file.

---

## 🔑 Default Credentials (After Seeding)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Superadmin** | `admin@eventsphere.com` | `admin123` |
| **Dept Admin (CSE)** | `cse@eventsphere.com` | `cseadmin` |

---

## 👨‍💻 Tech Stack

- **Frontend**: React, Vite, Framer Motion, Axios, Tailwind CSS.
- **Backend**: FastAPI, AsyncPG, Pydantic, Uvicorn.
- **Database**: PostgreSQL 15.
- **Infra**: Docker, Nginx, AWS EC2.

---

*Developed for EventSphere management and coordination.*
