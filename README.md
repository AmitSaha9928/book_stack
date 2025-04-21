# BookStack (Fullstack)

This repository contains both the **frontend** (React / Next.js) and **backend** (Node.js / Express / MongoDB) for the BookStack book review platform. It also includes a Docker setup to run both services together.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Docker Setup Guide](#docker-setup-guide)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Components Overview](#components-overview)
- [API Routes](#api-routes)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (for local backend)

Clone the repository:

```bash
git clone https://github.com/AmitSaha9928/book_stack.git
```

### Frontend Dependencies

```bash
cd my-app
npm install
```

### Backend Dependencies

```bash
cd server
npm install
```

---

## Development

### Running Frontend

```bash
cd my-app
npm run dev
```
Open <http://localhost:3000> in your browser.

### Running Backend

```bash
cd server
npm run dev
```
Server runs at <http://localhost:5000>.

---

## Docker Setup Guide

This guide will help you run both the frontend and backend using Docker. It assumes you have `Dockerfile`, `.dockerignore`, and `docker-compose.yml` in the root.

### Prerequisites

- **Docker**: Install from <https://www.docker.com/>
- **Docker Compose**: Install from <https://docs.docker.com/compose/>

### Getting Started with Docker

1. **Clone the repo** (if you haven't yet):
   ```bash
   git clone https://github.com/AmitSaha9928/book_stack.git
   ```

2. **Build & start containers**:
   ```bash
   docker-compose up --build
   ```
   - Builds images for both services
   - Starts containers
   - Frontend: <http://localhost:3000>
   - Backend: <http://localhost:3999>

3. **Stop containers**:
   ```bash
   docker-compose down
   ```

### Troubleshooting

- Verify Docker & Compose installations
- Confirm each service’s `Dockerfile` is in `frontend/` and `backend/`
- View logs for errors:
  ```bash
  docker-compose logs
  ```

---


## Frontend Overview

The frontend is a Next.js application written in React. It connects to the backend API to manage books, users, and reviews.

Key scripts in `package.json`:

- `dev` — Run development server
- `build` — Build for production
- `start` — Start production server
- `test` — Run Jest unit tests
- `cypress` — Run Cypress E2E tests

---

## Backend Overview

The backend is an Express.js server using MongoDB via Mongoose. It exposes RESTful endpoints for books, categories, and users.

Key scripts in `package.json`:

- `dev` — Run with nodemon for development
- `start` — Start production server
- `test` — Run Jest tests
- `format` — Apply Prettier formatting

---


## API Routes

### Books

| Method | Route           | Description                  | Auth  |
| ------ | --------------- | ---------------------------- | ----- |
| GET    | `/books`        | List all books               | No    |
| POST   | `/books`        | Create a book                | Yes   |
| GET    | `/books/:id`    | Retrieve a book by ID        | No    |
| PUT    | `/books/:id`    | Update a book by ID          | Yes   |
| DELETE | `/books/:id`    | Delete a book by ID          | Yes   |

### Categories

| Method | Route                  | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | `/categories`          | List categories       |
| GET    | `/categories/:id`      | Get category by ID    |

### Users

| Method | Route                  | Description                   |
| ------ | ---------------------- | ----------------------------- |
| POST   | `/auth/register`       | Register new user             |
| POST   | `/auth/login`          | Login & receive JWT           |

---

## Technologies Used

- **React** & **Next.js**
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **Axios**, **Tailwind CSS**, **SweetAlert2**
- **Docker** & **Docker Compose**
- **Jest** & **Cypress**
- **JWT**, **Bcrypt**, **dotenv**

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Backend (`backend/.env`)

```ini
MONGO_URI=mongodb://localhost:27017/bookstack
JWT_SECRET=your_jwt_secret
PORT=3999
```

---
