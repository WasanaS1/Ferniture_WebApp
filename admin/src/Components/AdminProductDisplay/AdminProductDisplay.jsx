import React, { useState, useEffect } from 'react'
import './AdminProductDisplay.css'
import { MdOutlineStar, MdOutlineStarOutline } from "react-icons/md";
import { CiSquareRemove } from "react-icons/ci";
import API_CONFIG from '../../config/api';

const AdminProductDisplay = ({ product, onRemove, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    
    useEffect(() => {
        if (product && product.id) {
            fetchReviews();
        }
    }, [product]);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const response = await fetch(`${API_CONFIG.BASE_URL}/reviews/${product.id}`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleRemoveReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to remove this review?')) {
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/removereview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    reviewId: reviewId
                })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Review removed successfully');
                fetchReviews(); // Refresh reviews
            } else {
                alert(data.message || 'Failed to remove review');
            }
        } catch (error) {
            console.error('Error removing review:', error);
            alert('Error removing review');
        }
    };
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
                
                {/* Reviews Management Section */}
                <div className="admin-reviews-section">
                    <h3>Customer Reviews Management</h3>
                    {loadingReviews ? (
                        <p>Loading reviews...</p>
                    ) : (
                        <div className="admin-reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="admin-review-item">
                                        <div className="admin-review-header">
                                            <div className="reviewer-info">
                                                <span className="reviewer-name">{review.customerName}</span>
                                                {review.verified && <span className="verified-badge">Verified</span>}
                                            </div>
                                            <div className="review-actions">
                                                <div className="review-rating">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveReview(review.id)}
                                                    className="remove-review-btn"
                                                    title="Remove Review"
                                                >
                                                    <CiSquareRemove />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="review-date">
                                            {new Date(review.date).toLocaleDateString()}
                                        </div>
                                        <div className="review-comment">
                                            "{review.comment}"
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews for this product yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminProductDisplay
