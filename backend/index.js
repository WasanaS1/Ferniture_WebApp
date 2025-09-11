require("dotenv").config();
const port = process.env.PORT || 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Import security middleware
const { hashPassword, comparePassword } = require('./utils/password');
const { authenticateToken, generateToken } = require('./middleware/auth');
const { 
    signupValidation, 
    loginValidation, 
    productValidation, 
    checkValidationResult 
} = require('./middleware/validation');
const { 
    generalLimiter, 
    authLimiter, 
    productLimiter, 
    cartLimiter, 
    helmetConfig, 
    sanitizeInput 
} = require('./middleware/security');

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(sanitizeInput);
app.use(generalLimiter);
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Additional CORS middleware for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, auth-token');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

const allowedOrigins = [
    'https://ferniture-webapp-frontend.onrender.com',
    'https://ferniture-webapp-admin.onrender.com',
    'http://localhost:3000', // Frontend development server
    'http://localhost:5173', // Admin development server (Vite)
    'http://127.0.0.1:3000', // Alternative localhost
    'http://127.0.0.1:5173'  // Alternative localhost
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        console.log(`CORS blocked request from origin: ${origin}`);
        const message = `CORS policy does not allow access from ${origin}`;
        return callback(new Error(message), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'auth-token'],
    credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// API creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Test endpoint for CORS
app.get("/test", (req, res) => {
    res.json({
        message: "Backend is working",
        timestamp: new Date().toISOString(),
        origin: req.get('origin') || 'no-origin'
    });
});

// Image storage configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Configure static file serving with proper CORS headers
app.use('/images', (req, res, next) => {
    // Set CORS headers before serving static files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
}, express.static('upload/images'));

// Alternative image serving route for better CORS handling
app.get('/api/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'upload', 'images', filename);
    
    // Set comprehensive CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Type', 'image/jpeg');
    
    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

// Upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    try {
        console.log('File upload request received');
        console.log('File info:', req.file);
        
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: "No file uploaded"
            });
        }
        
        // Use the new API route that has better CORS handling
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://ferniture-webapp-backend.onrender.com/api/image/' 
            : `http://localhost:${port}/api/image/`;

        const imageUrl = `${baseUrl}${req.file.filename}`;
        console.log('Generated image URL:', imageUrl);

        res.json({
            success: 1,
            Image_url: imageUrl,
        });
    } catch (error) {
        console.error('Error in upload endpoint:', error);
        res.status(500).json({
            success: 0,
            message: "Error uploading file"
        });
    }
});

// Mongoose schema for products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }], // Additional images for gallery
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    sizes: [{ type: String }], // Array of size options
    tags: [{ type: String }], // Array of tags
    subcategory: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// API to add product
app.post('/addproduct', productLimiter, productValidation, checkValidationResult, async (req, res) => {
    try {
        console.log('Add product request received:', req.body);
        
        const products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            images: req.body.images || [],
            category: req.body.category,
            new_price: parseFloat(req.body.new_price),
            old_price: parseFloat(req.body.old_price),
            description: req.body.description || "",
            rating: parseFloat(req.body.rating) || 0,
            reviewCount: parseInt(req.body.reviewCount) || 0,
            sizes: req.body.sizes || [],
            tags: req.body.tags || [],
            subcategory: req.body.subcategory || "",
            inStock: req.body.inStock !== undefined ? req.body.inStock : true,
        });

        console.log('Product to be saved:', product);
        await product.save();
        console.log('Product saved successfully');
        
        res.json({ success: true, name: req.body.name, id: id });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Error adding product", error: error.message });
    }
});

// API to delete product
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "Error removing product" });
    }
});

// API to get all products
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
});

// Import User model
const Users = require('./models/User');

// User signup endpoint
app.post('/signup', authLimiter, signupValidation, checkValidationResult, async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
        }

        // Hash the password
        const hashedPassword = await hashPassword(req.body.password);

        const cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword, // Store hashed password
            cartData: cart,
        });
        await user.save();

        const token = generateToken(user.id);
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: "Error during signup" });
    }
});

// User login endpoint
app.post('/login', authLimiter, loginValidation, checkValidationResult, async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = await comparePassword(req.body.password, user.password);
            if (passCompare) {
                const token = generateToken(user.id);
                res.json({ success: true, token });
            } else {
                res.status(400).json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.status(400).json({ success: false, errors: "Wrong Email" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Error during login" });
    }
});

// Endpoint for new collections
app.get('/newcollection', async (req, res) => {
    try {
        let products = await Product.find({});
        let newCollection = products.slice(-8);
        res.send(newCollection);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).json({ success: false, message: "Error fetching new collections" });
    }
});

// Middleware to fetch user for cart item
const fetchuser = authenticateToken; // Use the new secure middleware

// Endpoint for adding to cart
app.post('/addtocart', cartLimiter, fetchuser, async (req, res) => {
    try {
        if (!req.body.itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        userData.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
});

// Remove from cart
app.post('/removefromcart', cartLimiter, fetchuser, async (req, res) => {
    try {
        if (!req.body.itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        }
        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
});

// Get cart data
app.post('/getcart', fetchuser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json(userData.cartData);
    } catch (error) {
        console.error("Error getting cart data:", error);
        res.status(500).json({ success: false, message: "Error getting cart data" });
    }
});

// Start server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port);
    } else {
        console.error("Error: " + error);
    }
});
