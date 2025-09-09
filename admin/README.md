# Furniture Web App - Admin Panel

This is the admin panel for the Furniture Web Application, built with React + Vite. It provides an interface for managing products, orders, and other administrative tasks.

## Features

- Product management (Add, Edit, Delete products)
- Order management
- User management
- Dashboard analytics
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running

## Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
- Runs the app in development mode
- Open [http://localhost:5173](http://localhost:5173) to view it in your browser
- Hot module replacement (HMR) enabled for fast development

### Build for Production
```bash
npm run build
```
- Builds the app for production to the `dist` folder
- Optimizes the build for best performance

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally for testing

## Project Structure

```
src/
├── Components/
│   ├── AddProduct/     # Product addition form
│   ├── ListProduct/    # Product listing and management
│   ├── Navbar/         # Navigation bar
│   └── Sidebar/        # Admin sidebar navigation
├── Pages/
│   └── Admin/          # Main admin dashboard
├── assets/             # Images and static assets
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## API Configuration

Make sure your backend API is running on `http://localhost:4000` or update the API base URL in your configuration files.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- Vite
- React Router DOM
- React Icons
- ESLint
