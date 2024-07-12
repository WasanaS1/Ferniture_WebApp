import React, { useState } from 'react'
import './Navbar.css'

import logo from '../Assests/logo.png'
import { FaCommentDollar, FaOpencart } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menu,setMenu] = useState("shop")
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>UniqueYou</p>
      </div>
      <ul className='nav-menu'>
        <li onClick={()=>{setMenu("Shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="Shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Kitchen")}}><Link style={{textDecoration:'none'}} to='/Kitchen'>Kitchen</Link>{menu==="Kitchen"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Leving area")}}><Link style={{textDecoration:'none'}} to='/Leving area'>Leving area</Link>{menu==="Leving area"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Room")}}><Link style={{textDecoration:'none'}} to='/Room'>Room</Link>{menu==="Room"?<hr/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        <Link to='/login'><button>Login</button></Link>
        <Link to='/cart'><FaOpencart /></Link>
        <div className='nav-cart-count'>0</div>
      </div>
    </div>
  )
}

export default Navbar

