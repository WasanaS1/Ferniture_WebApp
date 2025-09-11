import React from 'react'
import './AdminProductDisplay.css'
import { MdOutlineStar, MdOutlineStarOutline } from "react-icons/md";
import { CiSquareRemove } from "react-icons/ci";

const AdminProductDisplay = ({ product, onRemove, onClose }) => {
    if (!product || !product.image || !product.name) {
        return <div>Loading...</div>; 
    }

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<MdOutlineStar key={i} className='star filled' />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<MdOutlineStar key={i} className='star half' />);
            } else {
                stars.push(<MdOutlineStarOutline key={i} className='star empty' />);
            }
        }
        return stars;
    };

    const handleRemove = () => {
        if (window.confirm('Are you sure you want to remove this product?')) {
            onRemove(product.id);
        }
    };

    return (
        <div className='admin-productdisplay-overlay'>
            <div className='admin-productdisplay-modal'>
                <button className='close-btn' onClick={onClose}>×</button>
                
                <div className='admin-productdisplay'>
                    <div className="admin-productdisplay-left">
                        <div className="admin-productdisplay-img-list">
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                        </div>
                        <div className="admin-productdisplay-img">
                            <img className="admin-productdisplay-main-img" src={product.image} alt="" />
                        </div>
                    </div>
                    <div className="admin-productdisplay-right">
                        <h1>{product.name}</h1>
                        {product.subcategory && (
                            <p className="subcategory">{product.subcategory}</p>
                        )}
                        
                        <div className="admin-productdisplay-right-star">
                            {renderStars(product.rating)}
                            <p>({product.rating || 0}) • {product.reviewCount || 0} reviews</p>
                        </div>
                        
                        <div className="admin-productdisplay-right-price">
                            <div className="admin-productdisplay-right-price-old">${product.old_price}</div>
                            <div className="admin-productdisplay-right-price-new">${product.new_price}</div>
                        </div>
                        
                        <div className="admin-productdisplay-right-description">
                            {product.description || 'No description available for this product.'}
                        </div>
                        
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="admin-productdisplay-right-size">
                                <h3>Available Sizes</h3>
                                <div className="admin-productdisplay-right-sizes">
                                    {product.sizes.map((size, index) => (
                                        <div key={index} className="size-option">{size}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="admin-product-actions">
                            <button className="remove-product-btn" onClick={handleRemove}>
                                <CiSquareRemove className='remove-icon'/>
                                Remove Product
                            </button>
                        </div>
                        
                        <div className="admin-product-details">
                            <p className='admin-productdisplay-right-category'>
                                <span>Category:</span> {product.category}
                                {product.subcategory && ` • ${product.subcategory}`}
                            </p>
                            
                            {product.tags && product.tags.length > 0 && (
                                <p className='admin-productdisplay-right-category'>
                                    <span>Tags:</span> {product.tags.join(', ')}
                                </p>
                            )}
                            
                            <div className="admin-product-info">
                                <p><strong>Product ID:</strong> {product.id}</p>
                                <p><strong>Stock Status:</strong> 
                                    <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.inStock ? ' In Stock' : ' Out of Stock'}
                                    </span>
                                </p>
                                <p><strong>Available:</strong> {product.available ? 'Yes' : 'No'}</p>
                                <p><strong>Date Added:</strong> {new Date(product.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminProductDisplay
