import React, { createContext, useEffect, useState } from "react";
// import all_product from '../Components/Assests/all_product';


export const FurnitureContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <300+1;index++){
        cart[index] = 0;
    }
    return cart;
}

const FurnitureContextProvider = (props)=>{

    //for backend
    const [all_product,setAll_Product] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());
    const url = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-webapp-backend.onrender.com'
        : 'http://localhost:4000';

    useEffect(()=>{
        fetch(`${url}/allproducts`)
        .then(async (response)=>{
            if (!response.ok) {
                // log raw body for debugging when server returns 500 or other errors
                const text = await response.text().catch(()=>"<unreadable body>");
                console.error('Error fetching /allproducts:', response.status, text);
                setAll_Product([]);
                return null;
            }
            return response.json();
        })
        .then((data)=>{
            if (Array.isArray(data)) {
                setAll_Product(data);
            } else if (data === null) {
                // already handled above
            } else {
                console.error('Unexpected /allproducts response shape:', data);
                setAll_Product([]);
            }
        })
        .catch((err)=>{
            console.error('Network/error fetching /allproducts:', err);
            setAll_Product([]);
        });

        if(localStorage.getItem('auth-token')){
            fetch(`${url}/getcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            })
            .then((respons)=>respons.json())
            .then((data)=>setCartItems(data));
        }
    },[])

    //forntend
    
    
    const addToCart = async (itemId) => {
        // Check if user is authenticated
        if(!localStorage.getItem('auth-token')){
            // User is not logged in, return false to indicate failure
            return false;
        }
        
        try {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
            //formbackend
            const response = await fetch(`${url}/addtocart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            });
            
            const data = await response.json();
            if (!data.success) {
                console.error('Failed to add to cart:', data.message);
                // Revert optimistic update
                setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
                return false;
            }
            
            return true; // Successfully added to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Revert optimistic update
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
            return false;
        }
    }
    
    const removeFromCart = async (itemId) => {
        try {
            setCartItems((prev)=>({...prev,[itemId]:Math.max(0, prev[itemId]-1)}));
            
            if(localStorage.getItem('auth-token')){
                const response = await fetch(`${url}/removefromcart`,{
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({"itemId":itemId}),
                });
                
                const data = await response.json();
                if (!data.success) {
                    console.error('Failed to remove from cart:', data.message);
                    // Revert optimistic update
                    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            // Revert optimistic update
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
            return false;
        }
    }

    // New function to update cart quantity directly
    const updateCartQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 0) return false;
        
        const currentQuantity = cartItems[itemId] || 0;
        const difference = newQuantity - currentQuantity;
        
        try {
            setCartItems((prev)=>({...prev,[itemId]:newQuantity}));
            
            if(localStorage.getItem('auth-token')){
                // Make multiple API calls based on the difference
                for (let i = 0; i < Math.abs(difference); i++) {
                    const endpoint = difference > 0 ? '/addtocart' : '/removefromcart';
                    const response = await fetch(`${url}${endpoint}`,{
                        method:'POST',
                        headers:{
                            Accept:'application/form-data',
                            'auth-token':`${localStorage.getItem('auth-token')}`,
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify({"itemId":itemId}),
                    });
                    
                    const data = await response.json();
                    if (!data.success) {
                        console.error('Failed to update cart quantity:', data.message);
                        // Revert optimistic update
                        setCartItems((prev)=>({...prev,[itemId]:currentQuantity}));
                        return false;
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            // Revert optimistic update
            setCartItems((prev)=>({...prev,[itemId]:currentQuantity}));
            return false;
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0)
            {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    // Function to update product data after review changes
    const updateProductReviews = (productId, newReviews, newRating) => {
        setAll_Product(prevProducts => 
            prevProducts.map(product => {
                // Ensure both are compared as numbers
                const isMatch = Number(product.id) === Number(productId);
                if (isMatch) {
                    return { ...product, reviews: newReviews, rating: newRating };
                }
                return product;
            })
        );
    };

    // Function to refresh cart data
    const refreshCart = async () => {
        if(localStorage.getItem('auth-token')){
            try {
                const response = await fetch(`${url}/getcart`,{
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'Content-Type':'application/json',
                    },
                    body:"",
                });
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                console.error('Error refreshing cart:', error);
            }
        } else {
            // User logged out, reset cart
            setCartItems(getDefaultCart());
        }
    };

    // Function to refresh all products data
    const refreshProducts = async () => {
        try {
            const response = await fetch(`${url}/allproducts`);
            if (!response.ok) {
                const text = await response.text().catch(()=>"<unreadable body>");
                console.error('Error refreshing products:', response.status, text);
                setAll_Product([]);
                return;
            }
            const data = await response.json();
            if (Array.isArray(data)) setAll_Product(data);
            else {
                console.error('Unexpected refreshProducts response:', data);
                setAll_Product([]);
            }
        } catch (error) {
            console.error('Error refreshing products:', error);
        }
    };

    // Function to clear the entire cart
    const clearCart = async () => {
        try {
            setCartItems(getDefaultCart());
            
            if(localStorage.getItem('auth-token')){
                // Clear cart on backend by removing all items
                const itemIds = Object.keys(cartItems).filter(id => cartItems[id] > 0);
                
                for (const itemId of itemIds) {
                    const quantity = cartItems[itemId];
                    for (let i = 0; i < quantity; i++) {
                        await fetch(`${url}/removefromcart`,{
                            method:'POST',
                            headers:{
                                Accept:'application/form-data',
                                'auth-token':`${localStorage.getItem('auth-token')}`,
                                'Content-Type':'application/json',
                            },
                            body:JSON.stringify({"itemId":parseInt(itemId)}),
                        });
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    };

    // Function to place an order
    const placeOrder = async (customerInfo, paymentMethod = 'cash_on_delivery') => {
        try {
            if(!localStorage.getItem('auth-token')){
                return { success: false, message: "Please login to place an order" };
            }

            const response = await fetch(`${url}/placeorder`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerInfo, paymentMethod }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Clear local cart after successful order
                setCartItems(getDefaultCart());
                return { success: true, order: data.order, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error placing order:', error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    // Function to get user's orders
    const getUserOrders = async () => {
        try {
            if(!localStorage.getItem('auth-token')){
                return { success: false, message: "Please login to view orders" };
            }

            const response = await fetch(`${url}/myorders`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    // Function to get specific order details
    const getOrderDetails = async (orderId) => {
        try {
            if(!localStorage.getItem('auth-token')){
                return { success: false, message: "Please login to view order details" };
            }

            const response = await fetch(`${url}/order/${orderId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        getUserOrders,
        getOrderDetails,
        updateProductReviews,
        refreshProducts,
        refreshCart
    };

    return (
       <FurnitureContext.Provider value= {contextValue}>
       {props.children}
       </FurnitureContext.Provider>
    )
}

export default FurnitureContextProvider; 