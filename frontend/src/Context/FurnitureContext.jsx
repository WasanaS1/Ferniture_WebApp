import React, { createContext } from "react";
import all_product from '../Components/Assests/all_product';
export const FurnitureContext = createContext(null)

const FurnitureContextProvider = (props)=>{
    const contectValue = {all_product}
    return (
       <FurnitureContext.Provider value= {contectValue}>
       {props.Indoor}
       </FurnitureContext.Provider>
    )
}

export default FurnitureContextProvider;