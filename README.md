
# MEP Portfolio and Material Supply and Labour Management System

A comprehensive full-stack application designed to manage MEP (Mechanical, Electrical, Plumbing) portfolios, material supplies, and labour for construction sites. This system streamlines site management, labour tracking, attendance monitoring, payroll processing, and portfolio oversight.

## Features

- **Site Management**: Create and manage construction sites with unique IDs, addresses, and locations
- **Labour Management**: Track workers with categories (electrician, plumber, HVAC tech, general, supervisor), hourly rates, and site assignments
- **Attendance Tracking**: Record daily check-in/check-out times, calculate total hours and overtime
- **Payroll Processing**: Automated payroll calculations based on attendance and hourly rates
- **Portfolio Management**: Manage MEP portfolios and projects
- **Material Supply Tracking**: Monitor inventory and material supplies
- **User Authentication**: Secure login system with JWT tokens
- **Responsive Dashboard**: Modern React-based admin interface

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Server directory with the following variables:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   JWT_SECRET=your-jwt-secret-key
   ```

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
1. Start the backend server:
   ```bash
   cd Server
   npm run dev
   ```
   The server will run on `http://localhost:5001`

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (default Vite port)

### Production Build
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Start the backend in production:
   ```bash
   cd Server
   npm start
   ```

## API Endpoints

The API provides RESTful endpoints for all major functionalities:

- **Sites**: `/api/sites` - CRUD operations for construction sites
- **Labours**: `/api/labours` - Manage workers and their details
- **Attendance**: `/api/attendances` - Track and manage attendance records
- **Payroll**: `/api/payroll` - Payroll processing and calculations
- **Portfolio**: `/api/portfolio` - Manage MEP portfolios and projects

For detailed API documentation, refer to the route files in `Server/routes/` and controller files in `Server/controllers/`.

## Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   ├── state/          # Redux store and slices
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── Server/                 # Backend Node.js application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middlewareservices/ # Middleware functions
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── TODO.md                 # Project tasks and progress
└── README.md               # This file
```

## Scripts

### Backend Scripts (in Server directory)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests (not implemented yet)

### Frontend Scripts (in client directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please contact the development team.
