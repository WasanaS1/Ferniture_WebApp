import React, { useContext, useState } from 'react'
import './Navbar.css';

import logo from '../Assests/logo.png';
import { FaCommentDollar, FaOpencart } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FurnitureContext } from '../../Context/FurnitureContext';

const Navbar = () => {
  const [menu,setMenu] = useState("Furniture");
  const {getTotalCartItems} = useContext(FurnitureContext); 
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>UniqueYou</p>
      </div>
      <ul className='nav-menu'>
        <li onClick={()=>{setMenu("Furniture")}}><Link style={{textDecoration:'none'}} to='/'>Furniture</Link>{menu==="Furniture"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Indoor")}}><Link style={{textDecoration:'none'}} to='/Indoor'>Indoor</Link>{menu==="Indoor"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Outdoor")}}><Link style={{textDecoration:'none'}} to='/Outdoor'>Outdoor</Link>{menu==="Outdoor"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Decorative")}}><Link style={{textDecoration:'none'}} to='/Decorative'>Decorative</Link>{menu==="Decorative"?<hr/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        <Link to='/login'><button>Login</button></Link>
        <div className='FaOpencart-icon'>
        <Link to='/cart'><FaOpencart /></Link>
        </div>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar

