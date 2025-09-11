import React, { useState } from 'react'
import AddProduct from './Components/AddProduct/AddProduct'
import ListProduct from './Components/ListProduct/ListProduct'
import Footer from './Components/Footer/Footer'
import logo from './assets/logo.png'
import profile_Icon from './assets/Profile_icon.png'
import './App.css'

const App = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false)

  const openAddProductModal = () => {
    setShowAddProductModal(true)
  }

  const closeAddProductModal = () => {
    setShowAddProductModal(false)
  }

  return (
    <div className="app">
      {/* Simple Header */}
      <header className="app-header">
        <div className="header-left">
          <img src={logo} alt="UniqueYou Logo" className="header-logo" />
          <div className="header-brand">
            <h1>UniqueYou</h1>
            <span>Admin Panel</span>
          </div>
        </div>
        <div className="header-center">
          <h2 className="dashboard-title">Furniture Management Dashboard</h2>
        </div>
        <div className="header-right">
          <button 
            className="add-product-btn"
            onClick={openAddProductModal}
          >
            Add Product
          </button>
          <img src={profile_Icon} alt="Profile" className="profile-picture" />
        </div>
      </header>

      {/* Main Content - Always shows Product List */}
      <main className="app-main">
        <ListProduct />
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={closeAddProductModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="close-btn" onClick={closeAddProductModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <AddProduct onProductAdded={closeAddProductModal} />
            </div>
          </div>
        </div>
      )}

      <Footer/>
    </div>
  )
}

export default App