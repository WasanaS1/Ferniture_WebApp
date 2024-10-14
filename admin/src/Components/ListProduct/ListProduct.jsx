import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import { CiSquareRemove } from "react-icons/ci";

const ListProduct = () => {

    const [allproduct,setAllProducts] = useState([]);

    const fetchInfor = async()=>{
      await fetch('https://ferniture-webapp-backend.onrender.com/alllprducts')
      .then((res)=>res.json())
      .then((data)=>{setAllProducts(data)});
    }

    useEffect(()=>{
      fetchInfor();
    },[])

    const remove_product = async(id)=>{
      await fetch('https://ferniture-webapp-backend.onrender.com/removeproduct',{
          method:'POST',
          headers:{
              Accept:'application/json',
              'Content-Type':'application/json',
          },
          body:JSON.stringify({id:id})
      })
      await fetchInfor();
    }

  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Product</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproduct.map((product,index)=>{
            return <><div key={index} className="listproduct-format-main  listproduct-format">
              <img src={product.image} className='listproduct-productitem' alt="" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <CiSquareRemove onClick={()=>{remove_product(product.id)}} className='listproduct-removeicon'/>
            </div>
            <hr />
            </>
          })}
        </div>
    </div>
  )
}

export default ListProduct