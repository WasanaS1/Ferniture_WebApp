import React, { useContext, useState } from 'react';
import { FurnitureContext } from '../../Context/FurnitureContext';
import './Checkout.css';

const Checkout = () => {
    const { getTotalCartAmount, all_product, cartItems, clearCart } = useContext(FurnitureContext);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        // Here you would typically send the order to your backend
        console.log('Order details:', {
            customerInfo,
            items: cartItems,
            total: getTotalCartAmount()
        });
        
        // Clear the cart after successful order
        await clearCart();
        setOrderPlaced(true);
    };

    const getCartItemsArray = () => {
        return all_product.filter(product => cartItems[product.id] > 0);
    };

    if (orderPlaced) {
        return (
            <div className="checkout-success">
                <h2>Order Placed Successfully! 🎉</h2>
                <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
                <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="checkout">
            <div className="checkout-container">
                <div className="checkout-form">
                    <h2>Checkout</h2>
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
                        
                        <button type="submit" className="place-order-btn">
                            Place Order - ${getTotalCartAmount().toFixed(2)}
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
