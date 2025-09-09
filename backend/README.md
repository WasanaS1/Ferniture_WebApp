# Furniture Web App - Backend API

This is the backend API server for the Furniture Web Application, built with Node.js, Express, and MongoDB. It provides RESTful APIs for product management, user authentication, and order processing.

## Features

- RESTful API endpoints
- User authentication with JWT
- Product CRUD operations
- File upload for product images
- MongoDB database integration
- CORS configuration for frontend/admin access
- Image storage with Multer

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or cloud)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGO_DB_URL="your_mongodb_connection_string"
PORT=4000
JWT_SECRET="your_jwt_secret_key"
```

## Running the Application

### Development Mode
```bash
node index.js
```
- Starts the server on http://localhost:4000
- The server will connect to MongoDB and start listening for requests

### Production Mode
For production, consider using PM2 or a similar process manager:
```bash
npm install -g pm2
pm2 start index.js --name "furniture-api"
```

## API Endpoints

### Products
- `GET /allproducts` - Get all products
- `POST /addproduct` - Add new product (with image upload)
- `POST /removeproduct` - Remove product by ID
- `GET /newcollections` - Get latest products
- `GET /popularproducts` - Get popular products

### Users
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /addtocart` - Add item to cart
- `POST /removefromcart` - Remove item from cart
- `POST /getcart` - Get user's cart items

### File Upload
- `POST /upload` - Upload product images
- Static files served from `/images` endpoint

## Project Structure

```
backend/
├── index.js           # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── upload/
    └── images/       # Uploaded product images
```

## Database Schema

### Product Model
```javascript
{
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: Date,
  available: Boolean
}
```

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  cartData: Object,
  date: Date
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_DB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | Server port | `4000` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |

## CORS Configuration

The server is configured to accept requests from:
- `https://ferniture-webapp-frontend.onrender.com`
- `https://ferniture-webapp-admin.onrender.com`
- Local development (any origin)

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **multer** - File upload middleware
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## API Testing

You can test the API endpoints using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example API call:
```bash
curl -X GET http://localhost:4000/allproducts
```

## Deployment

For deployment, ensure:
1. Environment variables are properly set
2. MongoDB database is accessible
3. Static file serving is configured
4. CORS origins are updated for production domains

## Security Considerations

- JWT tokens are used for authentication
- Passwords should be hashed (consider adding bcrypt)
- Input validation should be implemented
- Rate limiting should be added for production
- HTTPS should be used in production
