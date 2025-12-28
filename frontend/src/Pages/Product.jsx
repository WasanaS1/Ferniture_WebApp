import React, { useContext } from 'react';
import {FurnitureContext} from '../Context/FurnitureContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';

const Product = () => {
  const {all_product} = useContext(FurnitureContext);
  const {productId} = useParams();
  const product = all_product.find((e) => {
    if (!e) return false;
    // match by numeric id, string id, or Mongo _id
    return Number(e.id) === Number(productId) || String(e.id) === String(productId) || String(e._id) === String(productId);
  });

  if (!product) {
    // If products are still loading, show loading; otherwise product truly not found
    const loading = all_product.length === 0;
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        {loading ? 'Loading products...' : 'Product not found'}
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