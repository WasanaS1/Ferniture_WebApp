import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import { RiFunctionAddFill } from "react-icons/ri";
import { RiFileList3Fill } from "react-icons/ri";

const Sidbar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
              <RiFunctionAddFill className='sidebar-item-addproducticon'/>
              <p>Add Product</p>
            </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
              <RiFileList3Fill className='sidebar-item-listproduct'/>
              <p>Product List</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidbar