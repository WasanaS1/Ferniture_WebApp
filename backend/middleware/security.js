const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: {
            success: false,
            message: message
        },
        standardHeaders: true,
        legacyHeaders: false,
        // Store rate limit info in memory (consider Redis for production)
        store: new rateLimit.MemoryStore()
    });
};

// General API rate limiter
const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
);

// Strict rate limiter for authentication endpoints
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 login attempts per windowMs
    'Too many authentication attempts from this IP, please try again later.'
);

// Product creation rate limiter (for admin operations)
const productLimiter = createRateLimiter(
    60 * 1000, // 1 minute
    10, // limit each IP to 10 product operations per minute
    'Too many product operations from this IP, please slow down.'
);

// Cart operations rate limiter
const cartLimiter = createRateLimiter(
    60 * 1000, // 1 minute
    30, // limit each IP to 30 cart operations per minute
    'Too many cart operations from this IP, please slow down.'
);

// Helmet configuration for security headers
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Disable for file uploads
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// Request sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Remove any potential XSS characters
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Basic XSS prevention
                obj[key] = obj[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+=/gi, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
};

// IP whitelist middleware (optional for admin operations)
const ipWhitelist = (allowedIPs) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        
        if (allowedIPs.includes(clientIP) || allowedIPs.includes('all')) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Access denied from this IP address.'
            });
        }
    };
};

module.exports = {
    generalLimiter,
    authLimiter,
    productLimiter,
    cartLimiter,
    helmetConfig,
    sanitizeInput,
    ipWhitelist
};
