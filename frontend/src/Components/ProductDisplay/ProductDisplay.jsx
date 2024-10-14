import React, { useContext } from 'react'
import './ProductDisplay.css'
import { MdOutlineStar } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";
import { FurnitureContext } from '../../Context/FurnitureContext';

const ProductDisplay = (props) => {
    const {product} =props;
    const {addToCart} = useContext(FurnitureContext);

    if (!product || !product.image || !product.name) {
        return <div>Loading...</div>; 
    }

  return (
    <div className='productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
            </div>
            <div className="productdisplay-img">
                <img className="productdisplay-main-img" src={product.image} alt="" />
            </div>
        </div>
        <div className="productdisplay-right">
            <h1>{product.name}</h1>
            <div className="productdisplay-rigt-star">
                <MdOutlineStar className='MdOutlineStar'/><MdOutlineStar className='MdOutlineStar' /><MdOutlineStar className='MdOutlineStar' /><MdOutlineStar className='MdOutlineStar' /><MdOutlineStarOutline className='MdOutlineStar' />
                <p>(199)</p>
            </div>
            <div className="productdisplay-right-price">
                <div className="productdisplay-right-price-old">${product.old_price}</div>
                <div className="productdisplay-right-price-new">${product.new_price}</div>
            </div>
            <div className="productdisplay-right-description">
            Enhance your dining experience with our Classic Wooden Dining Table Set. Crafted from high-quality solid wood, this elegant table set offers durability and timeless style. The set includes a spacious rectangular table and six matching chairs, each featuring a comfortable cushioned seat. Perfect for family gatherings and dinner parties, this set will be the centerpiece of your dining room.
            </div>
            <div className="productdisplay-right-size">
                <h1>Select Size</h1>
                <div className="productdisplay-right-sizes">
                    <div>72" L x 36" W x 30" H</div>
                    <div>18" W x 20" D x 38" H</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(product.id)}}>Add To Cart</button>
            <p className='productdisplay-right-category'><span>Category :</span>Living Room Furniture,Dining Room Furniture</p>
            <p className='productdisplay-right-category'><span>Tag :</span>Solid Wood,Modern Design,Ergonomic</p>
        
        </div>
    </div>
  )
}

export default ProductDisplay