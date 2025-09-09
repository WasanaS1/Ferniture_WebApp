# Furniture Web App - Customer Frontend

This is the customer-facing frontend of the Furniture Web Application, built with React. It provides a complete e-commerce experience for browsing and purchasing furniture.

## Features

- Product catalog with categories (Indoor, Outdoor, Decorative)
- Product search and filtering
- Shopping cart functionality
- User authentication (Login/Signup)
- Product details and descriptions
- Responsive design for all devices
- Breadcrumb navigation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm start
```
- Runs the app in development mode
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser
- The page will reload when you make changes
- You may also see any lint errors in the console

### Build for Production
```bash
npm run build
```
- Builds the app for production to the `build` folder
- It correctly bundles React in production mode and optimizes the build for the best performance
- The build is minified and the filenames include the hashes
- Your app is ready to be deployed!

### Run Tests
```bash
npm test
```
- Launches the test runner in the interactive watch mode

## Project Structure

```
src/
├── Components/
│   ├── Assets/         # Images and static files
│   ├── Breadcrums/     # Breadcrumb navigation
│   ├── CartItems/      # Shopping cart components
│   ├── DescriptionBox/ # Product description display
│   ├── Footer/         # Footer component
│   ├── Hero/           # Hero section
│   ├── Item/           # Product item card
│   ├── Navbar/         # Navigation bar
│   ├── NewCollections/ # New collections showcase
│   └── ProductDisplay/ # Product detail display
├── Context/
│   └── FurnitureContext.jsx # Global state management
├── Pages/
│   ├── Cart.jsx        # Shopping cart page
│   ├── Furniture.jsx   # Main furniture page
│   ├── FurnitureCategory.jsx # Category pages
│   ├── LoginSingup.jsx # Authentication page
│   └── Product.jsx     # Individual product page
└── CSS/                # Styling files
```

## API Configuration

Make sure your backend API is running on `http://localhost:4000` or update the API base URL in your configuration files.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production  
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## Technologies Used

- React 18
- React Router DOM
- React Context API for state management
- React Icons
- Create React App

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
