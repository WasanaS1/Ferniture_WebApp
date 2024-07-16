import React, { createContext, useState } from "react";
import all_product from '../Components/Assests/all_product';


export const FurnitureContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <all_product.length+1;index++){
        cart[index] = 0;
    }
    return cart;
}

const FurnitureContextProvider = (props)=>{
    const [cartItems,setCartItems] = useState(getDefaultCart());
    
    const addToCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        // console.log(cartItems);
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    }

    const contextValue = {all_product,cartItems,addToCart,removeFromCart};

    return (
       <FurnitureContext.Provider value= {contextValue}>
       {props.children}
       </FurnitureContext.Provider>
    )
}

export default FurnitureContextProvider;