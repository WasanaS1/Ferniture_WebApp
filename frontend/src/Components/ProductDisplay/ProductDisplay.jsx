import React, { useContext } from 'react'
import './ProductDisplay.css'
import { MdOutlineStar } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";
import { FurnitureContext } from '../../Context/FurnitureContext';

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(FurnitureContext);

    if (!product || !product.image || !product.name) {
        return <div>Loading...</div>; 
    }

    // Helper function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<MdOutlineStar key={i} className='MdOutlineStar filled' />);
        }
        
        if (hasHalfStar) {
            stars.push(<MdOutlineStar key="half" className='MdOutlineStar half-filled' />);
        }
        
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<MdOutlineStarOutline key={`empty-${i}`} className='MdOutlineStar' />);
        }
        
        return stars;
    };

    // Get product images - use images array if available, otherwise fallback to main image
    const productImages = product.images && product.images.length > 0 
        ? product.images 
        : [product.image, product.image, product.image, product.image];

    // Ensure we have at least 4 images for the gallery
    while (productImages.length < 4) {
        productImages.push(product.image);
    }

    const rating = product.rating || 0;
    const reviewCount = product.reviews ? product.reviews.length : 0;

  return (
    <div className='productdisplay'>
        <div className='productdisplay-main'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {productImages.slice(0, 4).map((img, index) => (
                        <img key={index} src={img} alt={`${product.name} ${index + 1}`} />
                    ))}
                </div>
                <div className="productdisplay-img">
                    <img className="productdisplay-main-img" src={product.image} alt={product.name} />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-rigt-star">
                    {renderStars(rating)}
                    <p>({reviewCount})</p>
                </div>
                <div className="productdisplay-right-price">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    {product.description || "No description available for this product."}
                </div>
                {product.specifications && product.specifications.length > 0 && (
                    <div className="productdisplay-right-size">
                        <h1>Available Specifications</h1>
                        <div className="productdisplay-right-sizes">
                            {product.specifications.map((specification, index) => (
                                <div key={index}>{specification}</div>
                            ))}
                        </div>
                    </div>
                )}
                <button onClick={()=>{addToCart(product.id)}}>Add To Cart</button>
                <p className='productdisplay-right-category'>
                    <span>Category :</span> {product.category}
                    {product.subcategory && `, ${product.subcategory}`}
                </p>
                {product.tags && product.tags.length > 0 && (
                    <p className='productdisplay-right-category'>
                        <span>Tags :</span> {product.tags.join(', ')}
                    </p>
                )}
                {!product.inStock && (
                    <p className='productdisplay-out-of-stock'>
                        <span>⚠️ Currently Out of Stock</span>
                    </p>
                )}
            </div>
        </div>
    </div>
  )
}

export default ProductDisplay