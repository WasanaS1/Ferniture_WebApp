const mongoose = require('mongoose');

// Order schema for managing customer orders
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    customerInfo: {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipCode: {
            type: String,
            required: true,
            trim: true
        }
    },
    items: [{
        productId: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    orderSummary: {
        subtotal: {
            type: Number,
            required: true
        },
        shipping: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery', 'card', 'paypal', 'bank_transfer'],
        default: 'cash_on_delivery'
    },
    trackingNumber: {
        type: String,
        default: ''
    },
    estimatedDelivery: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for formatted order ID display
orderSchema.virtual('formattedOrderId').get(function() {
    return `ORD-${this.orderId}`;
});

// Method to calculate estimated delivery date
orderSchema.methods.calculateEstimatedDelivery = function() {
    const deliveryDays = 7; // 7 days default delivery time
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    this.estimatedDelivery = estimatedDate;
};

// Static method to generate unique order ID
orderSchema.statics.generateOrderId = async function() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp}${random}`;
};

module.exports = mongoose.model('Order', orderSchema);
