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
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

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
    
    
    const addToCart = (itemId) => {
        // Check if user is authenticated
        if(!localStorage.getItem('auth-token')){
            // User is not logged in, return false to indicate failure
            return false;
        }
        
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        //formbackend
        fetch(`${url}/addtocart`,{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json',
            },
            body:JSON.stringify({"itemId":itemId}),
        })
        .then((respons)=>respons.json())
        .then((data)=>console.log(data));
        
        return true; // Successfully added to cart
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch(`${url}/removefromcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((respons)=>respons.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
            
        }return totalAmount;
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
            const data = await response.json();
            setAll_Product(data);
        } catch (error) {
            console.error('Error refreshing products:', error);
        }
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
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