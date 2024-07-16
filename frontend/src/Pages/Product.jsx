import React from 'react'
import {FurnitureContext} from '../Context/FurnitureContext'
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
const Product = () => {
  const {all_product} =useContext(FurnitureContext);
  const {productId} = useParams();
  const product = all_product.find((e)=>e.id===Number(productId))
  return (
    <div>
        
    </div>
  )
}

export default Product