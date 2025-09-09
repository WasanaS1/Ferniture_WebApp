# Furniture Web Application

A complete full-stack e-commerce web application for furniture shopping, built with React, Node.js, Express, and MongoDB.

## Project Overview

This furniture web application consists of three main components:

1. **Frontend** - Customer-facing React application for browsing and purchasing furniture
2. **Admin Panel** - React-based admin interface for managing products and orders  
3. **Backend** - Node.js/Express API server with MongoDB database

## Features

### Customer Frontend
- Browse furniture by categories (Indoor, Outdoor, Decorative)
- Product search and filtering
- Shopping cart functionality
- User authentication and registration
- Responsive design
- Product details and descriptions

### Admin Panel
- Product management (Add, Edit, Delete)
- Order management
- Dashboard analytics
- Image upload for products
- Inventory tracking

### Backend API
- RESTful API endpoints
- JWT authentication
- File upload handling
- MongoDB integration
- CORS configuration

## Technology Stack

- **Frontend**: React 18, React Router, Create React App
- **Admin**: React 18, Vite, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Database**: MongoDB Atlas

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or MongoDB Atlas)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ferniture_WebApp
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file with:
# MONGO_DB_URL="your_mongodb_connection_string"
# PORT=4000
# JWT_SECRET="your_jwt_secret"

node index.js
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

### 4. Setup Admin Panel
```bash
cd ../admin
npm install
npm run dev
```

## Application URLs

Once all services are running:

- **Customer Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:4000

## Project Structure

```
Ferniture_WebApp/
├── frontend/          # Customer React application
│   ├── src/
│   ├── public/
│   └── package.json
├── admin/             # Admin React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js API server
│   ├── index.js
│   ├── upload/
│   └── package.json
└── README.md
```

## Environment Configuration

### Backend (.env)
```env
MONGO_DB_URL="mongodb+srv://username:password@cluster.mongodb.net/database"
PORT=4000
JWT_SECRET="your_secret_key"
```

## API Endpoints

### Products
- `GET /allproducts` - Fetch all products
- `POST /addproduct` - Add new product
- `POST /removeproduct` - Remove product
- `GET /newcollections` - Get latest products
- `GET /popularproducts` - Get popular items

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login

### Cart Management
- `POST /addtocart` - Add item to cart
- `POST /removefromcart` - Remove from cart
- `POST /getcart` - Get cart items

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Admin Development
```bash
cd admin
npm run dev
```

### Backend Development
```bash
cd backend
node index.js
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Admin
```bash
cd admin
npm run build
```

## Deployment

This application is deployed on [Render.com](https://render.com) with automatic deployment from GitHub.

### Live Application URLs

- **Customer Frontend**: https://ferniture-webapp-frontend.onrender.com
- **Admin Panel**: https://ferniture-webapp-admin.onrender.com
- **Backend API**: https://ferniture-webapp-backend.onrender.com

### Deployment Architecture

```
GitHub Repository → Render.com → Live Application
     ↓                 ↓              ↓
  Code Changes    Auto-Deploy    Updated Website
```

### Services Deployed

1. **Backend Service** (`ferniture-webapp-backend`)
   - **Platform**: Render Web Service
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment**: Node.js
   - **Database**: MongoDB Atlas

2. **Frontend Service** (`ferniture-webapp-frontend`)
   - **Platform**: Render Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Framework**: React (Create React App)

3. **Admin Service** (`ferniture-webapp-admin`)
   - **Platform**: Render Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Framework**: React + Vite

### Environment Variables (Production)

#### Backend (.env)
```env
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/furniture_db
PORT=4000
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

### Deployment Process

#### Initial Setup (Already Done)
1. **Create Render Account**: Sign up at render.com
2. **Connect GitHub**: Link your GitHub repository
3. **Create Services**: Set up three separate services (backend, frontend, admin)
4. **Configure Environment Variables**: Set production environment variables
5. **Deploy**: Render automatically deploys from the main branch

#### Updating Deployment
To update the live application with new changes:

```bash
# 1. Make your changes locally
# 2. Test locally to ensure everything works
# 3. Commit your changes
git add .
git commit -m "Description of your changes"

# 4. Push to GitHub
git push origin main

# 5. Render automatically deploys the changes
# Monitor deployment at: https://dashboard.render.com
```

### Deployment Features

- ✅ **Auto-Deployment**: Pushes to `main` branch trigger automatic deployment
- ✅ **HTTPS**: All services are served over HTTPS
- ✅ **Custom Domains**: Can be configured if needed
- ✅ **Environment Variables**: Securely managed through Render dashboard
- ✅ **Build Logs**: Available for debugging deployment issues
- ✅ **Health Checks**: Automatic monitoring and restart of services

### Monitoring Deployment

1. **Render Dashboard**: https://dashboard.render.com
2. **Check Service Status**: Monitor all three services
3. **View Logs**: Check build and runtime logs for issues
4. **Performance**: Monitor response times and uptime

### Production Configuration

#### CORS Settings
The backend is configured to accept requests from:
```javascript
const allowedOrigins = [
    'https://ferniture-webapp-frontend.onrender.com',
    'https://ferniture-webapp-admin.onrender.com'
];
```

#### Database
- **MongoDB Atlas**: Cloud database with automatic backups
- **Connection**: Secured with username/password authentication
- **Performance**: Optimized for production workloads

### Troubleshooting Deployment

#### Common Issues:
1. **Build Failures**: Check build logs in Render dashboard
2. **Environment Variables**: Ensure all required variables are set
3. **CORS Errors**: Verify frontend URLs in backend CORS configuration
4. **Database Connection**: Check MongoDB Atlas connectivity

#### Quick Fixes:
```bash
# Force rebuild (if needed)
git commit --allow-empty -m "Force rebuild"
git push origin main
```

### Deployment Costs
- **Render Free Tier**: Suitable for development and small projects
- **Paid Tiers**: Available for production with better performance
- **MongoDB Atlas**: Free tier available, pay-as-you-scale

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

**Note**: Make sure to configure your MongoDB connection string in the backend `.env` file before running the application.
