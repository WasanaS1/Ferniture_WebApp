require("dotenv").config();
const port = process.env.PORT || 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());

const allowedOrigins = [
    'https://ferniture-webapp-frontend.onrender.com',
    'https://ferniture-webapp-admin.onrender.com',
    'http://localhost:3000', // Frontend development server
    'http://localhost:5173'  // Admin development server (Vite)
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const message = `CORS policy does not allow access from ${origin}`;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    methods: 'GET,POST,PUT,DELETE',
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

// Image storage configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images')); // Serve images

// Upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-webapp-backend.onrender.com/images/' 
        : `http://localhost:${port}/images/`;

    res.json({
        success: 1,
        Image_url: `${baseUrl}${req.file.filename}`,
    });
});

// Mongoose schema for products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// API to add product
app.post('/addproduct', async (req, res) => {
    try {
        const products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Error adding product" });
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

// User schema
const Users = mongoose.model('Users', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now },
});

// User signup endpoint
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
        }

        const cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });
        await user.save();

        const data = { user: { id: user.id } };
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: "Error during signup" });
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = { user: { id: user.id } };
                const token = jwt.sign(data, 'secret_ecom');
                res.json({ success: true, token });
            } else {
                res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.json({ success: false, errors: "Wrong Email" });
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
const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Endpoint for adding to cart
app.post('/addtocart', fetchuser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        userData.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Error adding to cart");
    }
});

// Remove from cart
app.post('/removefromcart', fetchuser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        }
        res.send("Removed");
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).send("Error removing from cart");
    }
});

// Get cart data
app.post('/getcart', fetchuser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        res.json(userData.cartData);
    } catch (error) {
        console.error("Error getting cart data:", error);
        res.status(500).send("Error getting cart data");
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
