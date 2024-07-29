import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import profile_Icon from '../../assets/Profile_icon.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={logo} alt="" className="nav-logo" />
        <img src={profile_Icon} alt="" className='nav-profile'/>
    </div>
  )
}

export default Navbar