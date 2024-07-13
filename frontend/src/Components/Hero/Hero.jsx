import React from 'react'
import './Hero.css'
import { FaHandSparkles } from "react-icons/fa";
import { GiBranchArrow } from "react-icons/gi";
import hero_image from '../Assests/heroImage.png'
const Hero = () => {
  return (
    <div className='hero'>
        <div className='hero-left'>
            <h2>New Arrivals Only</h2>
            <div>
                <div className='hero-hand-icon'>
                    <p>NEW</p>
                    <FaHandSparkles className="sparkle-icon" />
                </div>
                <p>Collections</p>
                <p>for Everyone</p>
            </div>
            <div className='hero-latest-btn'>
                <div>Latest Collection</div>
                <GiBranchArrow />
            </div>
        </div>
        <div className='hero-right'>
            <img src={hero_image} alt="" />
        </div>
        
    </div>
  )
}

export default Hero