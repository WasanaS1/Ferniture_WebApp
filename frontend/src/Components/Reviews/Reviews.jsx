import React, { useState, useEffect } from 'react'
import './Reviews.css'
import { MdOutlineStar, MdOutlineStarOutline } from "react-icons/md";

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    
    // Review form state
    const [newReview, setNewReview] = useState({
        customerName: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/reviews/${productId}`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.reviews);
                setAverageRating(data.rating);
                setTotalReviews(data.reviewCount);
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
            const response = await fetch('http://localhost:4000/addreview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    customerName: newReview.customerName,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
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
                
                alert('Review added successfully!');
            } else {
                alert(data.message || 'Failed to add review');
            }
        } catch (err) {
            alert('Error adding review');
            console.error('Error adding review:', err);
        }
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        const stars = [];
        
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            stars.push(
                <span 
                    key={i}
                    className={`star ${interactive ? 'interactive' : ''} ${isFilled ? 'filled' : 'empty'}`}
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

    if (loading) return <div className="reviews-loading">Loading reviews...</div>;
    if (error) return <div className="reviews-error">{error}</div>;

    return (
        <div className="reviews-container">
            <div className="reviews-header">
                <h2>Customer Reviews</h2>
                <div className="rating-summary">
                    <div className="average-rating">
                        <div className="rating-stars">
                            {renderStars(averageRating)}
                        </div>
                        <span className="rating-number">{averageRating.toFixed(1)} out of 5</span>
                        <span className="review-count">({totalReviews} reviews)</span>
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
                    <h3>Write Your Review</h3>
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
                                placeholder="Share your experience with this product..."
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
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">{review.customerName}</span>
                                    {review.verified && <span className="verified-badge">Verified Purchase</span>}
                                </div>
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <div className="review-date">
                                {formatDate(review.date)}
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
    );
};

export default Reviews;
