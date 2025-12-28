import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './ProductDisplay.css'
import { MdOutlineStar } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";
import { FurnitureContext } from '../../Context/FurnitureContext';

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(FurnitureContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // selected thumbnail index for main image
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Reset selected index when product or images change (use optional chaining to avoid errors when product is undefined)
    useEffect(() => {
        setSelectedIndex(0);
    }, [product?.image, product?.images]);

    const handleAddToCart = async () => {
        // Check if user is authenticated
        if(!localStorage.getItem('auth-token')){
            // Store current location in sessionStorage for redirect after login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            // Navigate to login page
            navigate('/login');
            return;
        }
        
        // Check if product is in stock
        if (!product.inStock) {
            alert('Sorry, this product is currently out of stock.');
            return;
        }
        
        setIsAddingToCart(true);
        try {
            // User is authenticated, add to cart
            const success = await addToCart(product.id);
            if (success) {
                alert('Product added to cart successfully!');
            } else {
                alert('Failed to add product to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    }

    if (!product || !product.name) {
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

    // Build images array: primary image first, then any additional images (no padding)
    const productImages = [product.image, ...(product.images || [])].filter(Boolean).slice(0,4);

    const rating = product.rating || 0;
    const reviewCount = product.reviews ? product.reviews.length : 0;

    

  return (
    <div className='productdisplay'>
        <div className='productdisplay-main'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {productImages.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt={`${product.name} ${index + 1}`} 
                            className={index === selectedIndex ? 'active' : ''}
                            onClick={() => setSelectedIndex(index)}
                        />
                    ))}
                </div>
                <div className="productdisplay-img">
                    <img className="productdisplay-main-img" src={productImages[selectedIndex] || product.image} alt={product.name} />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-rigt-star">
                    {reviewCount > 0 ? (
                        <>
                            {renderStars(rating)}
                            <p>({reviewCount})</p>
                        </>
                    ) : (
                        <p style={{color:'#666'}}>{'No reviews yet'}</p>
                    )}
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
                <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.inStock}
                    className={`add-to-cart-btn ${!product.inStock ? 'out-of-stock' : ''}`}
                >
                    {isAddingToCart ? 'Adding...' : !product.inStock ? 'Out of Stock' : 'Add To Cart'}
                </button>
                <p className='productdisplay-right-category'>
                    <span>Category :</span> {product.category}
                    {product.subcategory && `, ${product.subcategory}`}
                </p>
                {product.tags && product.tags.length > 0 && (
                    <p className='productdisplay-right-category'>
                        <span>Tags :</span> {product.tags.join(', ')}
                    </p>
                )}
                {product.inStock ? (
                    <p className='productdisplay-in-stock'>
                        <span>In Stock</span>
                    </p>
                ) : (
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