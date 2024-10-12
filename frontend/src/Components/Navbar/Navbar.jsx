import React, { useContext, useRef, useState } from 'react'
import './Navbar.css';

import logo from '../Assests/logo.png';
import { FaCommentDollar, FaOpencart } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FurnitureContext } from '../../Context/FurnitureContext';
import dropdownIcon from '../Assests/dropdown.png'
const Navbar = () => {
  const [menu,setMenu] = useState("Furniture");
  const {getTotalCartItems} = useContext(FurnitureContext); 
  const menuRef = useRef();
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>UniqueYou</p>
      </div>
      <img src={dropdownIcon} alt="" onClick={dropdown_toggle} className='nav-dropdown' />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("Furniture")}}><Link style={{textDecoration:'none'}} to='/'>Furniture</Link>{menu==="Furniture"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Indoor")}}><Link style={{textDecoration:'none'}} to='/Indoor'>Indoor</Link>{menu==="Indoor"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Outdoor")}}><Link style={{textDecoration:'none'}} to='/Outdoor'>Outdoor</Link>{menu==="Outdoor"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Decorative")}}><Link style={{textDecoration:'none'}} to='/Decorative'>Decorative</Link>{menu==="Decorative"?<hr/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}} >Logout</button>
          :<Link to='/login'><button>Login</button></Link>
        }
        <div className='FaOpencart-icon'>
        <Link to='/cart'><FaOpencart /></Link>
        </div>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar

