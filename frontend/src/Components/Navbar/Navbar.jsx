import React, { useContext, useRef, useState, useEffect } from 'react'
import './Navbar.css';

import logo from '../Assests/logo.png';
import { FaCommentDollar, FaOpencart } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import { FurnitureContext } from '../../Context/FurnitureContext';
import dropdownIcon from '../Assests/dropdown.png'
const Navbar = () => {
  const [menu,setMenu] = useState("NewArrivals");
  const {getTotalCartItems, refreshCart} = useContext(FurnitureContext); 
  const menuRef = useRef();
  const location = useLocation();
  
  useEffect(() => {
    // Update menu state based on current route
    const path = location.pathname;
    if (path === '/furniture') {
      setMenu("NewArrivals");
    } else if (path === '/Indoor') {
      setMenu("Indoor");
    } else if (path === '/Outdoor') {
      setMenu("Outdoor");
    } else if (path === '/Decorative') {
      setMenu("Decorative");
    } else if (path === '/') {
      setMenu("AllProducts");
    }
  }, [location.pathname]);
  
  const handleLogout = async () => {
    localStorage.removeItem('auth-token');
    await refreshCart(); // Clear cart data
    window.location.replace('/');
  };
  
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <Link to='/' style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'8px'}} onClick={()=>{setMenu("AllProducts")}}>
          <img src={logo} alt="UniqueYou Logo" />
          <p>UniqueYou</p>
        </Link>
      </div>
      <img src={dropdownIcon} alt="" onClick={dropdown_toggle} className='nav-dropdown' />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("NewArrivals")}}><Link style={{textDecoration:'none'}} to='/furniture'>New Arrivals</Link>{menu==="NewArrivals"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Indoor")}}><Link style={{textDecoration:'none'}} to='/Indoor'>Indoor</Link>{menu==="Indoor"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Outdoor")}}><Link style={{textDecoration:'none'}} to='/Outdoor'>Outdoor</Link>{menu==="Outdoor"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Decorative")}}><Link style={{textDecoration:'none'}} to='/Decorative'>Decorative</Link>{menu==="Decorative"?<hr/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        {localStorage.getItem('auth-token')
          ?<button onClick={handleLogout} >Logout</button>
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

