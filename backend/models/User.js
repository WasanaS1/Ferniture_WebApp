const mongoose = require('mongoose');

// User schema with enhanced security
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8
    },
    cartData: { 
        type: Object, 
        default: {}
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: {
                loginAttempts: 1,
                lockUntil: 1
            }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // After 5 attempts, lock account for 2 hours
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = {
            lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
        };
    }
    
    return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: {
            loginAttempts: 1,
            lockUntil: 1
        },
        $set: {
            lastLogin: new Date()
        }
    });
};

// Don't return password in JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.loginAttempts;
    delete user.lockUntil;
    return user;
};

module.exports = mongoose.model('Users', userSchema);
