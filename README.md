# MERN E-commerce Application

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce application. It features a robust backend API and a dynamic frontend user interface, designed to handle various e-commerce functionalities including user authentication, product management, order processing, and more.

## Features

**Backend (Server-side):**
*   **User Authentication:** Secure user registration, login, and session management with JWT.
*   **Role-Based Access Control:** Separate routes and functionalities for users, sellers, and administrators.
*   **Product Management:** CRUD operations for products, including image uploads (Cloudinary integration).
*   **Order Processing:** Handling of customer orders, payment integration (Razorpay), and order status updates.
*   **Address Management:** User address storage and retrieval.
*   **Shopping Cart & Wishlist:** Functionality for managing items in cart and wishlist.
*   **Email Notifications:** Sending emails for various events (e.g., order confirmation, OTP).
*   **API Security:** Implemented with `helmet`, `hpp`, and rate limiting.
*   **Error Handling:** Centralized error handling middleware.

**Frontend (Client-side):**
*   **Responsive User Interface:** Built with React and styled using Tailwind CSS.
*   **Modular Component Structure:** Organized components for reusability and maintainability.
*   **Role-Based Layouts:** Different layouts for admin, seller, and user dashboards.
*   **Protected Routes:** Authentication-guarded routes for different user roles.
*   **Global State Management:** Using Zustand for efficient and scalable state management.
*   **API Integration:** Seamless communication with the backend API using Axios.
*   **User-Friendly Navigation:** Intuitive routing with `react-router-dom`.

## Technologies Used

**Backend:**
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database.
*   **Mongoose:** MongoDB object data modeling (ODM) library.
*   **JWT (JSON Web Tokens):** For authentication.
*   **Bcrypt.js:** For password hashing.
*   **Cloudinary:** Cloud-based image and video management.
*   **Nodemailer:** For sending emails.
*   **Razorpay:** Payment gateway integration.
*   **Morgan:** HTTP request logger middleware.
*   **Helmet:** Secures Express apps by setting various HTTP headers.
*   **HPP (HTTP Parameter Pollution):** Protection against parameter pollution attacks.
*   **Cookie-parser:** Parse Cookie header and populate `req.cookies`.
*   **Express-rate-limit:** Basic rate-limiting middleware.
*   **Express-validator:** Middleware for validating requests.
*   **XSS-clean:** Middleware to sanitize user input.

**Frontend:**
*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Next-generation frontend tooling.
*   **Tailwind CSS:** A utility-first CSS framework.
*   **Zustand:** A small, fast, and scalable bearbones state-management solution.
*   **React Router DOM:** Declarative routing for React.
*   **Axios:** Promise-based HTTP client.
*   **Lucide React:** A beautiful & consistent icon toolkit.
*   **React Hot Toast:** Declarative and accessible toast notifications.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or Yarn
*   MongoDB instance (local or cloud-based like MongoDB Atlas)
*   Cloudinary account (for image uploads)
*   Razorpay account (for payment gateway)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Ecommerce
    ```

2.  **Backend Setup:**
    Navigate to the `server` directory and install dependencies:
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add your environment variables. Refer to `server/.env.example` (if available) for required variables.
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    CLIENT_URL=http://localhost:5173
    ```

3.  **Frontend Setup:**
    Navigate to the `client` directory and install dependencies:
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client` directory and add your environment variables.
    ```
    VITE_API_URL=http://localhost:5000/api
    ```

### Running the Application

1.  **Start the Backend Server:**
    In the `server` directory, run:
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:5000`).

2.  **Start the Frontend Development Server:**
    In the `client` directory, run:
    ```bash
    npm run dev
    ```
    The frontend application will start on `http://localhost:5173` (or another available port).

## Project Structure

```
.
├── client/                 # Frontend (React) application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── App.jsx         # Main application component
│   │   ├── components/     # Reusable UI components (seller, shared, ui, user)
│   │   ├── config/         # Frontend configurations (e.g., axios instance)
│   │   ├── layouts/        # Layout components (admin, seller, user)
│   │   ├── pages/          # Page-level components (admin, seller, user)
│   │   ├── routes/         # Frontend routing setup
│   │   ├── store/          # Zustand state management stores
│   │   └── utils/          # Frontend utility functions
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Vite configuration
└── server/                 # Backend (Node.js/Express) application
    ├── config/             # Database and other configurations
    ├── controllers/        # Business logic for API endpoints
    ├── middlewares/        # Express middleware (auth, error handling)
    ├── models/             # Mongoose schemas and models
    ├── routes/             # API route definitions
    ├── utils/              # Backend utility functions (email, otp, token)
    ├── server.js           # Main server entry point
    └── package.json        # Backend dependencies and scripts
```

## Contributing

Feel free to fork the repository, create a new branch, and submit pull requests.

## License

This project is licensed under the ISC License.