import React from 'react'
import './Footer.css'
import footer_logo from '../Assests/logo.png'
import { FiInstagram } from "react-icons/fi";
import { CiFacebook } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa6";
const Footer = () => {
  return (
    <div className='footer'>
        <hr />
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>UniqueYou</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
                <FiInstagram className='footer-icon-container' />
                <CiFacebook className='footer-icon-container' />
                <FaWhatsapp className='footer-icon-container' />
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2024 - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer