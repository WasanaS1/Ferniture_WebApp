import React from 'react'
import './Footer.css'
import footer_logo from '../../assets/logo.png'

const Footer = () => {
  return (
    <footer className='admin-footer'>
        <div className="footer-content">
            <div className="footer-section footer-brand">
                <div className="footer-logo">
                    <img src={footer_logo} alt="UniqueYou Logo" />
                    <h2>UniqueYou</h2>
                </div>
                <p className="footer-description">
                    Admin Dashboard for managing furniture products, inventory, and orders. Streamlined interface for efficient store management.
                </p>
            </div>

            <div className="footer-section">
                <h3>Admin Tools</h3>
                <ul className="footer-links">
                    <li><a href="#addproduct">Add Product</a></li>
                    <li><a href="#listproduct">Product List</a></li>
                    <li><a href="#inventory">Inventory</a></li>
                    <li><a href="#orders">Orders</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Management</h3>
                <ul className="footer-links">
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#analytics">Analytics</a></li>
                    <li><a href="#settings">Settings</a></li>
                    <li><a href="#users">User Management</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Support</h3>
                <ul className="footer-links">
                    <li><a href="#help">Help Center</a></li>
                    <li><a href="#documentation">Documentation</a></li>
                    <li><a href="#contact">Contact Support</a></li>
                    <li><a href="#reports">Reports</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <div className="footer-bottom-content">
                <p>&copy; 2024 UniqueYou Admin Panel. All rights reserved.</p>
                <div className="footer-info">
                    <span>Version 1.0.0</span>
                    <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
