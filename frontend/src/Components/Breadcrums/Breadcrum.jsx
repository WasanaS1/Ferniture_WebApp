
import React from 'react'
import './Breadcrum.css'
import { IoArrowRedoCircleOutline } from "react-icons/io5";

const Breadcrum = (props) => {
    const { product } = props;

    if (!product || !product.category || !product.name) {
        return <div>Loading...</div>; 
    }

    return (
        <div className='breadcrum'>
            Home <IoArrowRedoCircleOutline />
            Furniture <IoArrowRedoCircleOutline />
            {product.category} <IoArrowRedoCircleOutline />
            {product.name}
        </div>
    )
}

export default Breadcrum;
