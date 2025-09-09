import React from 'react'
import './Footer.css'
import footer_logo from '../Assests/logo.png'
import { FiInstagram } from "react-icons/fi";
import { CiFacebook } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='footer'>
        <div className="footer-content">
            <div className="footer-section footer-brand">
                <div className="footer-logo">
                    <img src={footer_logo} alt="UniqueYou Logo" />
                    <h2>UniqueYou</h2>
                </div>
                <p className="footer-description">
                    Discover unique furniture pieces that transform your space into a reflection of your personal style. Quality craftsmanship meets modern design.
                </p>
                <div className="footer-social-icons">
                    <a href="#" className="social-link">
                        <FiInstagram className='footer-icon' />
                    </a>
                    <a href="#" className="social-link">
                        <CiFacebook className='footer-icon' />
                    </a>
                    <a href="#" className="social-link">
                        <FaWhatsapp className='footer-icon' />
                    </a>
                </div>
            </div>

            <div className="footer-section">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/furniture">New Arrivals</a></li>
                    <li><a href="/Indoor">Indoor</a></li>
                    <li><a href="/Outdoor">Outdoor</a></li>
                    <li><a href="/Decorative">Decorative</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Company</h3>
                <ul className="footer-links">
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/careers">Careers</a></li>
                    <li><a href="/blog">Blog</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Customer Service</h3>
                <ul className="footer-links">
                    <li><a href="/help">Help Center</a></li>
                    <li><a href="/shipping">Shipping Info</a></li>
                    <li><a href="/returns">Returns</a></li>
                    <li><a href="/size-guide">Size Guide</a></li>
                </ul>
            </div>

            <div className="footer-section footer-newsletter">
                <h3>Stay Connected</h3>
                <p>Subscribe to get updates on new arrivals and exclusive offers.</p>
                <div className="newsletter-form">
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit">Subscribe</button>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <div className="footer-bottom-content">
                <p>&copy; 2024 UniqueYou. All rights reserved.</p>
                <div className="footer-legal">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/cookies">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer