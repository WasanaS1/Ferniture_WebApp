import React, { createContext } from "react";
import all_product from '../Components/Assests/all_product';


export const FurnitureContext = createContext(null);

const FurnitureContextProvider = (props)=>{
    const contextValue = {all_product}
    return (
       <FurnitureContext.Provider value= {contextValue}>
       {props.children}
       </FurnitureContext.Provider>
    )
}

export default FurnitureContextProvider;