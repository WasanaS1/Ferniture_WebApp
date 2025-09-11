import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import { CiSquareRemove } from "react-icons/ci";
import API_CONFIG from '../../config/api';

const ListProduct = () => {

    const [allproduct,setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        } else {
          alert('Failed to remove product');
        }
      } catch (err) {
        console.error('Error removing product:', err);
        alert('Failed to remove product. Please try again.');
      }
    }

  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        
        {loading && <p>Loading products...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        
        {!loading && !error && (
          <>
            <div className="listproduct-format-main">
              <p>Image</p>
              <p>Product</p>
              <p>Old Price</p>
              <p>New Price</p>
              <p>Category</p>
              <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
              <hr />
              {allproduct.length > 0 ? (
                allproduct.map((product,index)=>{
                  return <><div key={index} className="listproduct-format-main  listproduct-format">
                    <img src={product.image} className='listproduct-productitem' alt="" />
                    <p>{product.name}</p>
                    <p>${product.old_price}</p>
                    <p>${product.new_price}</p>
                    <p>{product.category}</p>
                    <button 
                      onClick={()=>{
                        if(window.confirm('Are you sure you want to remove this product?')) {
                          remove_product(product.id)
                        }
                      }} 
                      className='listproduct-remove-btn'
                      title="Remove Product"
                    >
                      <CiSquareRemove className='listproduct-removeicon'/>
                      Remove
                    </button>
                  </div>
                  <hr />
                  </>
                })
              ) : (
                <p>No products found. Add some products first!</p>
              )}
            </div>
          </>
        )}
    </div>
  )
}

export default ListProduct