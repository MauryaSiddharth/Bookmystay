# Bookmystay 🏨

A full-stack, production-ready hotel booking application built with the **MERN (MongoDB, Express, React, Node.js) stack** using **TypeScript** on both the frontend and backend. The application features user authentication, a search/filter engine, Stripe payment integration, Cloudinary image upload, and hotel management dashboards.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (Fast dev builds and optimized production bundling)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safety across components, API clients, and forms)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first styling integrated natively with Vite)
- **State Management & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) (Server-state caching, loading/error boundary helpers, and automatic query retries)
- **Forms**: [React Hook Form](https://react-hook-form.com/) (Performance-optimized forms minimizing unnecessary DOM re-renders)
- **Payments**: [Stripe React SDK](https://stripe.com/docs/stripe-js/react) (Secure card input validation and client-side payment confirmation)
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (Declarative client-side routing)

### Backend
- **Framework**: [Express.js v5](https://expressjs.com/) (Modular API routing, middleware, and request validation)
- **Runtime**: [Node.js](https://nodejs.org/) (Executed using `tsx` in development and compiled JS in production)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) (Object Data Modeling for schema-enforced DB interactions)
- **Authentication**: JWT (JSON Web Tokens) sent via Secure HTTP-Only cookies
- **File Uploads**: [Multer](https://github.com/expressjs/multer) (Multipart form data processing stored in memory buffers)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (High-performance image hosting, optimization, and CDN delivery)
- **Validation**: [Express Validator](https://express-validator.github.io/docs/) (Backend request payload sanitization and assertions)
- **Payments**: [Stripe Node SDK](https://stripe.com/docs/api) (Server-side PaymentIntent generation and verification)

---

## 📂 Project Structure

```directory
Bookmystay/
├── backend/                    # Node.js + Express + TypeScript Backend
│   ├── dist/                   # Compiled JavaScript files (for production)
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT validation middleware
│   │   ├── models/
│   │   │   ├── hotel.model.ts  # Mongoose Schema for Hotels and embedded Bookings
│   │   │   └── user.model.ts   # Mongoose Schema for Users (with bcrypt hashing hook)
│   │   ├── routes/
│   │   │   ├── auth.routes.ts  # Login, token validation, and logout routes
│   │   │   ├── hotels.routes.ts# Public search, detail, and booking payment intent routes
│   │   │   ├── my-hotels.routes.ts # Admin hotel creation, retrieval, and updates
│   │   │   └── users.routes.ts # Registration and user profile endpoints
│   │   ├── shared/
│   │   │   └── types.ts        # Shared TypeScript interfaces (Hotel, User, Booking)
│   │   └── index.ts            # Entrypoint: DB connection, middlewares, and CORS
│   ├── package.json            # Backend scripts and dependencies
│   └── tsconfig.json           # Backend TypeScript compilation configurations
│
├── frontend/                   # React + TypeScript + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── Layout/
│   │   │   └── Layout.tsx      # Core shell layout (Header, Hero, Footer)
│   │   ├── api-client.ts       # Centralized Fetch API integrations with credentials
│   │   ├── components/         # Reusable UI components (Filters, SearchBar, Toast)
│   │   ├── config/             # Config arrays (Hotel types, facilities options)
│   │   ├── contexts/
│   │   │   └── AppContext.tsx  # Global Toast notifications & reactive auth state
│   │   ├── forms/              # Hotel Management Form components (Details, Images)
│   │   ├── pages/              # Page routes (Home, Search, Details, Booking, Dashboards)
│   │   ├── App.tsx             # Routing configuration and protected routes
│   │   ├── main.tsx            # React root mount point with Providers
│   │   └── index.css           # Global stylesheet containing Tailwind directives
│   ├── package.json            # Frontend scripts and dependencies
│   ├── vite.config.ts          # Vite build and tailwind plugin configurations
│   └── tsconfig.json           # Frontend TypeScript compilation rules
│
├── package.json                # Root config for workspace build orchestration
└── .env                        # Local workspace configuration variables
```

---

## ⚙️ Environment Configuration

To run the application, configure your environments in both `frontend` and `backend` directories.

### Backend Configurations
Create a `backend/.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_API_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend Configurations
Create a `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUB_KEY=your_stripe_publishable_key
```

---

## 🏃 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed locally or access to MongoDB Atlas.

### Installation & Execution

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd Bookmystay
   ```

2. **Start the Backend Development Server**:
   ```bash
   cd backend
   # Install dependencies
   npm install
   # Run Node backend in dev mode
   npm run dev
   ```

3. **Start the Frontend Development Server**:
   Open a new terminal session:
   ```bash
   cd frontend
   # Install dependencies
   npm install
   # Run React Vite frontend
   npm run dev
   ```

