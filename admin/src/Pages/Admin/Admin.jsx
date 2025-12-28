import React from 'react'
import './Admin.css'
// Sidebar removed: navigation moved to Navbar
import {Routes,Route} from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import OrderManagement from '../../Components/OrderManagement/OrderManagement'

const Admin = () => {
  return (
    <div className='admin'>
      <div className="app-main">
        <Routes>
          <Route path='/addproduct' element={<AddProduct/>} />
          <Route path='/listproduct' element={<ListProduct/>} />
          <Route path='/ordermanagement' element={<OrderManagement/>} />
        </Routes>
      </div>
    </div>
  )
}

export default Admin