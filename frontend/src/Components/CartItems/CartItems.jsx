import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './CartItems.css'
import { FurnitureContext } from '../../Context/FurnitureContext'
import { GiCrossedBones } from "react-icons/gi";
import { FaPlus, FaMinus } from "react-icons/fa";

const CartItems = () => {
    const navigate = useNavigate();
    const {
        getTotalCartAmount,
        all_product,
        cartItems,
        removeFromCart,
        addToCart,
        updateCartQuantity,
        clearCart
    } = useContext(FurnitureContext);
    
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState({});

    // Promo codes database
    const promoCodes = {
        'SAVE10': 10,
        'WELCOME20': 20,
        'FURNITURE15': 15,
        'NEWUSER25': 25
    };

    // Handle clear cart
    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            clearCart();
        }
    };

    // Handle checkout navigation
    const handleCheckout = () => {
        if(!localStorage.getItem('auth-token')){
            alert('Please login to proceed to checkout');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    // Handle quantity increase
    const handleQuantityIncrease = async (itemId) => {
        setIsUpdating(prev => ({...prev, [itemId]: true}));
        try {
            addToCart(itemId);
        } catch (error) {
            console.error('Error increasing quantity:', error);
        } finally {
            setIsUpdating(prev => ({...prev, [itemId]: false}));
        }
    };

    // Handle quantity decrease
    const handleQuantityDecrease = async (itemId) => {
        setIsUpdating(prev => ({...prev, [itemId]: true}));
        try {
            if (cartItems[itemId] > 1) {
                removeFromCart(itemId);
            } else {
                // If quantity is 1, show confirmation before removing
                if (window.confirm('Remove this item from cart?')) {
                    removeFromCart(itemId);
                }
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
        } finally {
            setIsUpdating(prev => ({...prev, [itemId]: false}));
        }
    };

    // Handle complete item removal
    const handleRemoveItem = (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            // Remove all quantities of this item
            const quantity = cartItems[itemId];
            for (let i = 0; i < quantity; i++) {
                removeFromCart(itemId);
            }
        }
    };

    // Handle promo code application
    const handlePromoCode = () => {
        const code = promoCode.toUpperCase().trim();
        if (code === '') {
            setPromoMessage('Please enter a promo code');
            return;
        }
        
        if (promoCodes[code]) {
            setPromoDiscount(promoCodes[code]);
            setPromoMessage(`✓ Promo code applied! ${promoCodes[code]}% discount`);
        } else {
            setPromoDiscount(0);
            setPromoMessage('Invalid promo code. Try: SAVE10, WELCOME20, FURNITURE15, NEWUSER25');
        }
    };

    // Calculate total with discount
    const getDiscountedTotal = () => {
        const subtotal = getTotalCartAmount();
        const discount = (subtotal * promoDiscount) / 100;
        return subtotal - discount;
    };

    // Get cart items array for easier manipulation
    const getCartItemsArray = () => {
        return all_product.filter(product => cartItems[product.id] > 0);
    };

    const cartItemsArray = getCartItemsArray();
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr />
        
        {cartItemsArray.length === 0 ? (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some furniture to your cart to get started!</p>
                <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                    Continue Shopping
                </button>
            </div>
        ) : (
            <>
                {cartItemsArray.map((product) => (
                    <div key={product.id}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={product.image} alt={product.name} className='carticon-product-icon' />
                            <div className="product-details">
                                <p className="product-name">{product.name}</p>
                                {!product.inStock && (
                                    <p className="out-of-stock-warning">⚠️ Currently out of stock</p>
                                )}
                            </div>
                            <p className="product-price">${product.new_price}</p>
                            <div className="quantity-controls">
                                <button 
                                    className="quantity-btn decrease"
                                    onClick={() => handleQuantityDecrease(product.id)}
                                    disabled={isUpdating[product.id] || cartItems[product.id] <= 0}
                                >
                                    <FaMinus />
                                </button>
                                <span className="quantity-display">
                                    {isUpdating[product.id] ? '...' : cartItems[product.id]}
                                </span>
                                <button 
                                    className="quantity-btn increase"
                                    onClick={() => handleQuantityIncrease(product.id)}
                                    disabled={isUpdating[product.id] || !product.inStock}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <p className="item-total">${(product.new_price * cartItems[product.id]).toFixed(2)}</p>
                            <button 
                                className="remove-item-btn"
                                onClick={() => handleRemoveItem(product.id)}
                                title="Remove from cart"
                            >
                                <GiCrossedBones />
                            </button>
                        </div>
                        <hr />
                    </div>
                ))}
            </>
        )}
        
        {cartItemsArray.length > 0 && (
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount().toFixed(2)}</p>
                        </div>
                        <hr />
                        {promoDiscount > 0 && (
                            <>
                                <div className="cartitems-total-item">
                                    <p>Discount ({promoDiscount}%)</p>
                                    <p>-${((getTotalCartAmount() * promoDiscount) / 100).toFixed(2)}</p>
                                </div>
                                <hr />
                            </>
                        )}
                        <div className="cartitems-total-item">
                            <p>Shipping</p>
                            <p>Free</p>
                        </div>    
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getDiscountedTotal().toFixed(2)}</h3>
                        </div>        
                    </div>
                    <div className="cart-action-buttons">
                        <button className="checkout-btn" onClick={handleCheckout}>Proceed To Checkout</button>
                        <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
                    </div>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input 
                            type="text" 
                            placeholder='Enter promo code' 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePromoCode()}
                        />
                        <button onClick={handlePromoCode}>Apply</button>
                    </div>
                    {promoMessage && (
                        <p className={`promo-message ${promoDiscount > 0 ? 'success' : 'error'}`}>
                            {promoMessage}
                        </p>
                    )}
                    <div className="available-codes">
                        <p>Available codes: SAVE10, WELCOME20, FURNITURE15, NEWUSER25</p>
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}

export default CartItems