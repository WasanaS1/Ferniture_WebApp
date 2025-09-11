import React, { useEffect, useContext } from 'react';
import {FurnitureContext} from '../Context/FurnitureContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';

const Product = () => {
  const {all_product} = useContext(FurnitureContext);
  const {productId} = useParams();
  const product = all_product.find((e)=>e.id===Number(productId));
  
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  if (!product) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Product not found or loading...
      </div>
    );
  }

  return (
    <div>
        <Breadcrum product={product}/>
        <ProductDisplay product={product}/>
        <DescriptionBox product={product}/>
    </div>
  )
}

export default Product