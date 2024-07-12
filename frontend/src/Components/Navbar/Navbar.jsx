import React, { useState } from 'react'
import './Navbar.css'

import logo from '../Assests/logo.png'
import { FaCommentDollar, FaOpencart } from "react-icons/fa6";

const Navbar = () => {
  const [menu,setMenu] = useState("shop")
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>UniqueYou</p>
      </div>
      <ul className='nav-menu'>
        <li onClick={()=>{setMenu("Shop")}}>Shop{menu==="Shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Kitchen")}}>Kitchen{menu==="Kitchen"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Leving area")}}>Leving area{menu==="Leving area"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Room")}}>Room{menu==="Room"?<hr/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        <button>Login</button>
        <FaOpencart />
        <div className='nav-cart-count'>0</div>
      </div>
    </div>
  )
}

export default Navbar

