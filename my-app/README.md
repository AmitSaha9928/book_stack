# BookStack Frontend (React / Next.js)

This project serves as the frontend for the BookStack book review platform. It is built using React with Next.js and integrates with a backend API to manage books, users, and reviews.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Folder Structure](#folder-structure)
- [Components Overview](#components-overview)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the frontend of BookStack, follow these steps:

```bash
# Clone the repository
git clone https://github.com/AmitSaha9928/book_stack.git

# Navigate into the project directory
cd bookstack-frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser and navigate to http://localhost:3000 to view the application.

## Development

### Running the Project

- **Development mode**:
  ```bash
  npm run dev
  ```

- **Production build & start**:
  ```bash
  npm run build
  npm run start
  ```

### Running Tests

- **Unit tests (Jest)**:
  ```bash
  npm run test
  ```

- **End-to-end tests (Cypress)**:
  ```bash
  npm run cypress
  ```


## Technologies Used

- **React** – UI library
- **Next.js** – SSR & SSG framework
- **Axios** – API requests
- **Tailwind CSS** – Styling
- **SweetAlert2** – Alerts & notifications
- **Cypress** – E2E testing
- **Jest** – Unit testing

## Environment Variables

Edit `.env.local` file with the desired variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/