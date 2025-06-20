# ChatApp

QuickChat is a full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO. It supports user authentication, profile management, image uploads, and instant messaging with online status indicators.

## Features

- User authentication (Sign up, Login, Logout)
- Real-time messaging with Socket.IO
- Online/offline user status
- Profile editing with image upload (Cloudinary)
- Responsive UI with Tailwind CSS
- Media sharing in chat
- Unread message count
- Protected routes and JWT-based authentication

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, Cloudinary, JWT, bcryptjs
- **Other:** React Hot Toast, ESLint, dotenv

## Project Structure

```
backend/
  controllers/
  lib/
  middleware/
  models/
  routes/
  .env
  server.js
  package.json
client/
  src/
    assets/
    components/
    context/
    lib/
    pages/
    App.jsx
    main.jsx
    index.css
  public/
  .env
  package.json
  vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Backend Setup

1. Go to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file (see `.env` example below).
4. Start the server:
   ```sh
   npm run server
   ```

#### Example `.env` for Backend

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
```

### Frontend Setup

1. Go to the `client` folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file:
   ```
   VITE_BACKEND_URL='http://localhost:5000'
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### Usage

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Sign up for a new account or log in.
- Start chatting with other users in real time!

## Scripts

### Backend

- `npm run server` — Start backend with nodemon
- `npm start` — Start backend with node

### Frontend

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

## License

MIT

---

**Developed by Tresor**