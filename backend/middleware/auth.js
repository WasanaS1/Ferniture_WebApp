const jwt = require('jsonwebtoken');
const Users = require('../models/User');

// Enhanced authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] || req.header('auth-token');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Optional: Verify user still exists
        const user = await Users.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is valid but user no longer exists.'
            });
        }

        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired.'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Please authenticate using a valid token.'
        });
    }
};

// Generate JWT token with expiration
const generateToken = (userId) => {
    const payload = {
        user: {
            id: userId
        }
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { 
            expiresIn: '24h', // Token expires in 24 hours
            issuer: 'furniture-app',
            audience: 'furniture-app-users'
        }
    );
};

// Verify and refresh token if needed
const verifyAndRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token will expire in the next hour
        const tokenExp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        const oneHour = 60 * 60;
        
        if (tokenExp - now < oneHour) {
            // Generate new token
            return generateToken(decoded.user.id);
        }
        
        return token; // Return original token if not near expiration
    } catch (error) {
        throw error;
    }
};

module.exports = {
    authenticateToken,
    generateToken,
    verifyAndRefreshToken
};
