import React, { useContext, useState } from 'react';
import { FurnitureContext } from '../../Context/FurnitureContext';
import './Checkout.css';

const Checkout = () => {
    const { getTotalCartAmount, all_product, cartItems, placeOrder } = useContext(FurnitureContext);
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Check if cart is empty
            const cartItemsArray = getCartItemsArray();
            if (cartItemsArray.length === 0) {
                setError('Your cart is empty. Please add items before checkout.');
                setIsLoading(false);
                return;
            }

            // Place order using context function
            const result = await placeOrder(customerInfo, 'cash_on_delivery');
            
            if (result.success) {
                setOrderDetails(result.order);
                setOrderPlaced(true);
            } else {
                setError(result.message || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getCartItemsArray = () => {
        return all_product.filter(product => cartItems[product.id] > 0);
    };

    if (orderPlaced) {
        return (
            <div className="checkout-success">
                <div className="success-container">
                    <h2>🎉 Order Placed Successfully!</h2>
                    {orderDetails && (
                        <div className="order-summary">
                            <p><strong>Order ID:</strong> {orderDetails.formattedOrderId}</p>
                            <p><strong>Total Amount:</strong> ${orderDetails.total?.toFixed(2)}</p>
                            <p><strong>Status:</strong> {orderDetails.status}</p>
                            {orderDetails.estimatedDelivery && (
                                <p><strong>Estimated Delivery:</strong> {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</p>
                            )}
                        </div>
                    )}
                    <p>Thank you for your purchase! You will receive an email confirmation shortly.</p>
                    <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout">
            <div className="checkout-container">
                <div className="checkout-form">
                    <h2>Checkout</h2>
                    {error && (
                        <div className="error-message">
                            <p style={{color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', margin: '10px 0'}}>
                                {error}
                            </p>
                        </div>
                    )}
                    <form onSubmit={handlePlaceOrder}>
                        <div className="form-section">
                            <h3>Customer Information</h3>
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={customerInfo.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={customerInfo.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={customerInfo.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-section">
                            <h3>Shipping Address</h3>
                            <input
                                type="text"
                                name="address"
                                placeholder="Street Address"
                                value={customerInfo.address}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={customerInfo.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={customerInfo.state}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="zipCode"
                                    placeholder="ZIP Code"
                                    value={customerInfo.zipCode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="place-order-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Placing Order...' : `Place Order - $${getTotalCartAmount().toFixed(2)}`}
                        </button>
                    </form>
                </div>
                
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                        {getCartItemsArray().map(product => (
                            <div key={product.id} className="summary-item">
                                <img src={product.image} alt={product.name} />
                                <div className="item-details">
                                    <p className="item-name">{product.name}</p>
                                    <p className="item-quantity">Qty: {cartItems[product.id]}</p>
                                    <p className="item-price">${(product.new_price * cartItems[product.id]).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>${getTotalCartAmount().toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="total-row total">
                            <strong>Total: ${getTotalCartAmount().toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
