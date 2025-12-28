import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import { CiSquareRemove } from "react-icons/ci";
import API_CONFIG from '../../config/api';
import AdminProductDisplay from '../AdminProductDisplay/AdminProductDisplay';

const ListProduct = () => {

    const [allproduct,setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchInfor = async()=>{
      try {
        setLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_PRODUCTS}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAllProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again.');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }

    useEffect(()=>{
      fetchInfor();
    },[])

    const remove_product = async(id)=>{
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REMOVE_PRODUCT}`,{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({id:id})
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
          await fetchInfor(); // Refresh the product list
          setSelectedProduct(null); // Close the modal if open
        } else {
          alert('Failed to remove product');
        }
      } catch (err) {
        console.error('Error removing product:', err);
        alert('Failed to remove product. Please try again.');
      }
    }

    const handleRowClick = (product) => {
      setSelectedProduct(product);
    }

    const handleCloseModal = () => {
      setSelectedProduct(null);
    }

    const renderStars = (rating) => {
      const stars = [];
      const fullStars = Math.floor(rating || 0);
      
      for (let i = 0; i < fullStars; i++) {
        stars.push('★');
      }
      for (let i = fullStars; i < 5; i++) {
        stars.push('☆');
      }
      return stars.join('') || 'No rating';
    }

  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <p className="click-hint">Click on any row to view product details</p>
        
        {loading && <p>Loading products...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        
        {!loading && !error && (
          <>
            <div className="listproduct-format-main listproduct-header">
              <p>Image</p>
              <p>Product</p>
              <p>Category</p>
              <p>Old Price</p>
              <p>New Price</p>
              <p>Rating</p>
              <p>Stock</p>
              <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
              <hr />
              {allproduct.length > 0 ? (
                allproduct.map((product,index)=>{
                  return (
                    <React.Fragment key={index}>
                      <div 
                        className="listproduct-format-main listproduct-format clickable-row"
                        onClick={() => handleRowClick(product)}
                      >
                        <img src={product.image} className='listproduct-productitem' alt="" />
                        <div className="product-name-cell">
                          <p className="product-name">{product.name}</p>
                          {product.subcategory && <p className="product-subcategory">{product.subcategory}</p>}
                        </div>
                        <p>{product.category}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <div className="rating-cell">
                          <span className="stars">{renderStars(product.rating || 0)}</span>
                          <span className="rating-number">({product.rating || 0})</span>
                          {product.reviews && product.reviews.length > 0 && <span className="review-count">{product.reviews.length} reviews</span>}
                        </div>
                        <p
                          className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newState = !product.inStock;
                            const msg = newState ? 'Mark this product as In Stock?' : 'Mark this product as Out of Stock?';
                            if (window.confirm(msg)) {
                              // call backend to toggle stock
                              fetch(`${API_CONFIG.BASE_URL}/togglestock`, {
                                method: 'POST',
                                headers: {
                                  Accept: 'application/json',
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ id: product.id, inStock: newState }),
                              })
                                .then(async (res) => {
                                  if (!res.ok) throw new Error(`Status ${res.status}`);
                                  const data = await res.json();
                                  if (data.success) {
                                    await fetchInfor();
                                  } else {
                                    alert('Failed to update stock');
                                  }
                                })
                                .catch((err) => {
                                  console.error('Error toggling stock:', err);
                                  alert('Error toggling stock.');
                                });
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                        <button 
                          onClick={(e)=>{
                            e.stopPropagation(); // Prevent row click when clicking remove button
                            if(window.confirm('Are you sure you want to remove this product?')) {
                              remove_product(product.id)
                            }
                          }} 
                          className='listproduct-remove-btn'
                          title="Remove Product"
                        >
                          <CiSquareRemove className='listproduct-removeicon'/>
                        </button>
                      </div>
                      <hr />
                    </React.Fragment>
                  )
                })
              ) : (
                <p>No products found. Add some products first!</p>
              )}
            </div>
          </>
        )}
        
        {/* Modal for product details */}
        {selectedProduct && (
          <AdminProductDisplay 
            product={selectedProduct}
            onRemove={remove_product}
            onClose={handleCloseModal}
          />
        )}
    </div>
  )
}

export default ListProduct