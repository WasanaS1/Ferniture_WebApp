import React from 'react'
import './Navbar.css'

import logo from '../Assests/logo.png'
import { FaOpencart } from "react-icons/fa6";

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>UniqueYou</p>
      </div>
      <ul className='nav-menu'>
        <li>Shop<hr/></li>
        <li>Kitchen</li>
        <li>Leving area</li>
        <li>Room</li>
      </ul>
      <div className='nav-login-cart'>
        <button>Login</button>
        <FaOpencart />
      </div>
    </div>
  )
}

export default Navbar

