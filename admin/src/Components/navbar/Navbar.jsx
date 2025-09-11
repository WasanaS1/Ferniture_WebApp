import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import profile_Icon from '../../assets/Profile_icon.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='nav-logo-section'>
        <div className='nav-logo'>
          <img src={logo} alt="UniqueYou Logo" />
          <div className='nav-brand'>
            <p>UniqueYou</p>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>
      <div className='nav-center'>
        <h2>Furniture Management Dashboard</h2>
      </div>
      <div className='nav-profile-section'>
        <div className='admin-info'>
          <span>Admin User</span>
          <img src={profile_Icon} alt="Profile" className='nav-profile'/>
        </div>
      </div>
    </div>
  )
}

export default Navbar