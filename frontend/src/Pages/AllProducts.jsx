import React, { useContext } from 'react'
import './CSS/AllProducts.css'
import { FurnitureContext } from '../Context/FurnitureContext'
import Item from '../Components/Item/Item'
import Hero from '../Components/Hero/Hero'

const AllProducts = () => {
  const { all_product } = useContext(FurnitureContext);

  return (
    <div>
      <Hero/>
      <div className='allproducts'>
        <h1>All Products</h1>
        <hr />
        <div className='products'>
          {all_product.map((item, i) => {
            return <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
              category={item.category}
              rating={item.rating}
              reviews={item.reviews}
              inStock={item.inStock}
            />
          })}
        </div>
      </div>
    </div>
  )
}

export default AllProducts
