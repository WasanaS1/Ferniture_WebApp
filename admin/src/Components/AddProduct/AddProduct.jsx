import React, { useState } from 'react'
import './AddProduct.css'
import { GrCloudUpload } from "react-icons/gr";

const AddProduct = () => {

    const [image,setimage] = useState(false);//for image hadler
    const [productDetails, setproductDetails] = useState({
        name:"",
        image:"",
        category:"Indoor",
        new_price:"",
        old_price:""
    })

    const imageHandler = (e)=>{
        setimage(e.target.files[0]);
    }
    const changeHandler = (e)=>{
        setproductDetails({...productDetails,[e.target.name]:e.target.value});
    } 

    const Add_Product = async ()=>{
        console.log(productDetails);
        //connect to back end
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);
        //to create image url
        await fetch('https://ferniture-webapp-backend.onrender.com/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((res)=>res.json()).then((data)=>{responseData=data});

        if(responseData.success){
            product.image = responseData.Image_url;
            console.log(product);
            //image upload to database
            await fetch('https://ferniture-webapp-backend.onrender.com/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((res)=>res.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed")
            });
        }
    }

  return (
    <div className='add-product'>
        <div className="addproduct-itemfeild">
            <p>Product title</p>
            <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfeild">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
            </div>
            <div className="addproduct-itemfeild">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
            </div>
        </div>
        <div className="addproduct-itemfeild">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Decorative">Decorative</option>
            </select>
        </div>
         {/* image input  */}
        <div className="addproduct-itemfeild">
            <label htmlFor="file-input">
                {   image?(
                    <img src={URL.createObjectURL(image)} className='addproduct-thumnail-img'/>)
                    :(
                        <GrCloudUpload className="addproduct-thumnail-img" />
                    )
                }
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
        </div>
        <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct