import React, { useState, useEffect, useContext } from 'react'
import './DescriptionBox.css'
import { MdOutlineStar, MdOutlineStarOutline } from "react-icons/md";
import { FurnitureContext } from '../../Context/FurnitureContext';

const DescriptionBox = ({ product }) => {
    const { updateProductReviews } = useContext(FurnitureContext);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    
    // Review form state
    const [newReview, setNewReview] = useState({
        customerName: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        if (activeTab === 'reviews' && product?.id) {
            fetchReviews();
        }
    }, [activeTab, product?.id]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const url = process.env.NODE_ENV === 'production' 
                ? 'https://ferniture-webapp-backend.onrender.com'
                : 'http://localhost:4000';
            
            const response = await fetch(`${url}/reviews/${product.id}`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.reviews || []);
            } else {
                setError('Failed to load reviews');
            }
        } catch (err) {
            setError('Error fetching reviews');
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!newReview.customerName.trim() || !newReview.comment.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const url = process.env.NODE_ENV === 'production' 
                ? 'https://ferniture-webapp-backend.onrender.com'
                : 'http://localhost:4000';
                
            const response = await fetch(`${url}/addreview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    customerName: newReview.customerName,
                    rating: newReview.rating,
                    comment: newReview.comment
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Reset form
                setNewReview({
                    customerName: '',
                    rating: 5,
                    comment: ''
                });
                setShowReviewForm(false);
                
                // Refresh reviews
                fetchReviews();
                
                // Update product reviews globally
                updateProductReviews(product.id, data.reviews, data.newRating);
                
                alert('Review submitted successfully!');
            } else {
                alert('Failed to submit review: ' + data.message);
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            alert('Error submitting review. Please try again.');
        }
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        const stars = [];
        
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            stars.push(
                <span
                    key={i}
                    className={`star ${interactive ? 'interactive' : ''} ${isFilled ? 'filled' : ''}`}
                    onClick={interactive ? () => onStarClick(i) : undefined}
                >
                    {isFilled ? <MdOutlineStar /> : <MdOutlineStarOutline />}
                </span>
            );
        }
        
        return stars;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!product) {
        return null;
    }

    const reviewCount = product.reviews ? product.reviews.length : 0;
    const hasDescription = product.description && product.description.trim().length > 0;

    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div 
                    className={`descriptionbox-nav-box ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </div>
                <div 
                    className={`descriptionbox-nav-box ${activeTab === 'reviews' ? 'active' : 'fade'}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviewCount})
                </div>
            </div>
            
            <div className="descriptionbox-content">
                {activeTab === 'description' && (
                    <div className="descriptionbox-description">
                        {hasDescription ? (
                            <p>{product.description}</p>
                        ) : (
                            <p>No detailed description available for this product.</p>
                        )}
                        
                        {product.category && (
                            <div className="product-details">
                                <h4>Product Details:</h4>
                                <ul>
                                    <li><strong>Category:</strong> {product.category}</li>
                                    {product.subcategory && (
                                        <li><strong>Subcategory:</strong> {product.subcategory}</li>
                                    )}
                                    {product.tags && product.tags.length > 0 && (
                                        <li><strong>Features:</strong> {product.tags.join(', ')}</li>
                                    )}
                                    <li><strong>Availability:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                                </ul>
                            </div>
                        )}

                        {product.specifications && product.specifications.length > 0 && (
                            <div className="product-specifications">
                                <h4>Available Specifications:</h4>
                                <div className="specifications-list">
                                    {product.specifications.map((specification, index) => (
                                        <div key={index} className="size-item">
                                            {specification}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'reviews' && (
                    <div className="descriptionbox-reviews">
                        <div className="reviews-header">
                            <h4>Customer Reviews ({reviewCount})</h4>
                            <div className="rating-summary">
                                <div className="average-rating">
                                    <div className="rating-stars">
                                        {renderStars(product.rating || 0)}
                                    </div>
                                    <span className="rating-number">
                                        {product.rating ? product.rating.toFixed(1) : '0.0'} out of 5
                                    </span>
                                    <span className="review-count">({reviewCount} reviews)</span>
                                </div>
                                <button 
                                    className="write-review-btn"
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                >
                                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                                </button>
                            </div>
                        </div>

                        {showReviewForm && (
                            <div className="review-form-container">
                                <h4>Write Your Review</h4>
                                <form onSubmit={handleSubmitReview} className="review-form">
                                    <div className="form-group">
                                        <label>Your Name:</label>
                                        <input
                                            type="text"
                                            value={newReview.customerName}
                                            onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Rating:</label>
                                        <div className="rating-input">
                                            {renderStars(newReview.rating, true, (rating) => 
                                                setNewReview({...newReview, rating})
                                            )}
                                            <span className="rating-text">({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})</span>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Your Review:</label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                            placeholder="Share your thoughts about this product..."
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    
                                    <button type="submit" className="submit-review-btn">
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="reviews-list">
                            {loading ? (
                                <div className="reviews-loading">Loading reviews...</div>
                            ) : error ? (
                                <div className="reviews-error">{error}</div>
                            ) : reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <div className="reviewer-info">
                                                <div className="reviewer-avatar">
                                                    {review.customerName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="reviewer-details">
                                                    <span className="reviewer-name">{review.customerName}</span>
                                                    {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
                                                    <div className="review-date">
                                                        {formatDate(review.date)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="review-rating">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <div className="review-comment">
                                            {review.comment}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-reviews">
                                    <p>No reviews yet. Be the first to review this product!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DescriptionBox