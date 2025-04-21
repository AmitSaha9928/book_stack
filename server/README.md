# BookStack Backend (Node.js / Express)

The backend for BookStack is built using Node.js with the Express.js framework. It provides APIs to manage books, users, and reviews and serves data to the frontend application.

## Table of Contents

- [Installation](#installation-backend)
- [Development](#development-backend)
- [Folder Structure](#folder-structure-backend)
- [API Routes](#api-routes)
- [Technologies Used](#technologies-used-backend)
- [Environment Variables](#environment-variables-backend)
- [Contributing](#contributing-backend)
- [License](#license-backend)

## Installation {#installation-backend}

```bash
# Clone the repository
git clone https://github.com/AmitSaha9928/book_stack.git

# Navigate into the project directory
cd bookstack-backend

# Install dependencies
npm install
```

Set up environment variables in a `.env` file:
```ini
MONGO_URI=mongodb://localhost:27017/bookstack
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the server:
```bash
npm start
```  
Server URL: `http://localhost:5000`

## Development {#development-backend}

- **Development mode**:
  ```bash
  npm run dev
  ```

- **Running Tests (Jest)**:
  ```bash
  npm run test
  ```

- **Code Formatting**:
  ```bash
  npm run format
  ```


## API Routes {#api-routes}

- **Books**
  - `GET /books` – Get all books
  - `POST /books` – Create a book (auth required)
  - `GET /books/:id` – Get a book by ID
  - `PUT /books/:id` – Update a book (auth required)
  - `DELETE /books/:id` – Delete a book (auth required)

- **Categories**
  - `GET /categories` – Get all categories
  - `GET /categories/:id` – Get category by ID

- **Users**
  - `POST /auth/register` – Register a new user
  - `POST /auth/login` – Log in and receive a JWT

## Technologies Used {#technologies-used-backend}

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT** – JSON Web Tokens for auth
- **Bcrypt** – Password hashing
- **dotenv** – Env var management

## Environment Variables {#environment-variables-backend}

```ini
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
PORT=<your-port>
```

