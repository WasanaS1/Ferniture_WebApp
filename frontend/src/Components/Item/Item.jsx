import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { MdOutlineStar } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";

const Item = (props) => {
    // Helper function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<MdOutlineStar key={i} className='item-star filled' />);
        }
        
        if (hasHalfStar) {
            stars.push(<MdOutlineStar key="half" className='item-star half-filled' />);
        }
        
        const remainingStars = 5 - Math.ceil(rating || 0);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<MdOutlineStarOutline key={`empty-${i}`} className='item-star' />);
        }
        
        return stars;
    };

    const rating = props.rating || 0;
    const reviewCount = props.reviews ? props.reviews.length : 0;

    return (
        <div className='item'>
            <Link to={`/product/${props.id}`}>
                <img src={props.image} alt={props.name || "Product"} />
            </Link>
            <div className="item-info">
                <p className="item-name">{props.name}</p>
                <div className="item-rating">
                    {renderStars(rating)}
                    <span className="item-review-count">({reviewCount})</span>
                </div>
                <div className='item-price'>
                    <div className='item-price-new'>
                        ${props.new_price}
                    </div>
                    <div className='item-price-old'>
                        ${props.old_price}
                    </div>
                </div>
                {props.category && (
                    <div className="item-category">
                        {props.category}
                    </div>
                )}
                {!props.inStock && (
                    <div className="item-out-of-stock">
                        Out of Stock
                    </div>
                )}
            </div>
        </div>
    )
}

export default Item