import React, { useState } from 'react'
import './AddProduct.css'
import { GrCloudUpload } from "react-icons/gr";
import API_CONFIG from '../../config/api';

const AddProduct = () => {

    const [image,setimage] = useState(false);//for image hadler
    const [loading, setLoading] = useState(false);
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
        try {
            // Validation before sending
            if (!productDetails.name.trim()) {
                alert("Please enter product name");
                return;
            }
            if (!productDetails.new_price || productDetails.new_price <= 0) {
                alert("Please enter valid new price");
                return;
            }
            if (!productDetails.old_price || productDetails.old_price <= 0) {
                alert("Please enter valid old price");
                return;
            }
            if (!image) {
                alert("Please select an image");
                return;
            }

            setLoading(true);
            console.log(productDetails);
            
            //connect to back end
            let responseData;
            let product = productDetails;

            let formData = new FormData();
            formData.append('product',image);
            
            //to create image url
            const uploadResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`,{
                method:'POST',
                headers:{
                    Accept:'application/json',
                },
                body:formData,
            });
            
            responseData = await uploadResponse.json();
            console.log("Upload response:", responseData);

            if(responseData.success){
                product.image = responseData.Image_url;
                console.log("Product to be added:", product);
                
                //image upload to database
                const addResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_PRODUCT}`,{
                    method:'POST',
                    headers:{
                        Accept:'application/json',
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(product),
                });
                
                const addResult = await addResponse.json();
                console.log("Add product response:", addResult);
                
                if(addResult.success) {
                    alert("Product Added Successfully!");
                    // Reset form
                    setproductDetails({
                        name:"",
                        image:"",
                        category:"Indoor",
                        new_price:"",
                        old_price:""
                    });
                    setimage(false);
                } else {
                    alert(`Failed to add product: ${addResult.message || 'Unknown error'}`);
                    if (addResult.errors) {
                        console.log("Validation errors:", addResult.errors);
                    }
                }
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Error adding product. Please try again.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className='add-product'>
        <div className="addproduct-itemfeild">
            <p>Product title</p>
            <input 
                value={productDetails.name} 
                onChange={changeHandler} 
                type="text" 
                name='name' 
                placeholder='Enter product name (min 3 characters)' 
                required
            />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfeild">
                <p>Price</p>
                <input 
                    value={productDetails.old_price} 
                    onChange={changeHandler} 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    name='old_price' 
                    placeholder='Enter original price' 
                    required
                />
            </div>
            <div className="addproduct-itemfeild">
                <p>Offer Price</p>
                <input 
                    value={productDetails.new_price} 
                    onChange={changeHandler} 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    name='new_price' 
                    placeholder='Enter sale price' 
                    required
                />
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
                    <img src={URL.createObjectURL(image)} className='addproduct-thumnail-img' alt="Product preview"/>)
                    :(
                        <GrCloudUpload className="addproduct-thumnail-img" />
                    )
                }
            </label>
            <input 
                onChange={imageHandler} 
                type="file" 
                name='image' 
                id='file-input' 
                hidden 
                accept="image/*"
                required
            />
            <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                Click to upload product image (required)
            </p>
        </div>
        <button 
            onClick={()=>{Add_Product()}} 
            className='addproduct-btn'
            disabled={loading}
        >
            {loading ? "Adding Product..." : "ADD PRODUCT"}
        </button>
    </div>
  )
}

export default AddProduct