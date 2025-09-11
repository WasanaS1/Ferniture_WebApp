import React, { useState } from 'react'
import './AddProduct.css'
import { GrCloudUpload } from "react-icons/gr";
import API_CONFIG from '../../config/api';

const AddProduct = ({ onProductAdded }) => {

    const [image,setimage] = useState(false);//for image hadler
    const [loading, setLoading] = useState(false);
    const [productDetails, setproductDetails] = useState({
        name:"",
        image:"",
        category:"Indoor",
        subcategory:"",
        new_price:"",
        old_price:"",
        description:"",
        rating:"0",
        specifications:[],
        tags:[],
        inStock:true
    })

    // State for managing dynamic arrays
    const [currentSpecification, setCurrentSpecification] = useState("");
    const [currentTag, setCurrentTag] = useState("");

    const imageHandler = (e)=>{
        setimage(e.target.files[0]);
    }
    
    const changeHandler = (e)=>{
        const { name, value, type, checked } = e.target;
        setproductDetails({
            ...productDetails,
            [name]: type === 'checkbox' ? checked : value
        });
    } 

    // Handle adding specifications
    const addSpecification = () => {
        if (currentSpecification.trim()) {
            setproductDetails({
                ...productDetails,
                specifications: [...productDetails.specifications, currentSpecification.trim()]
            });
            setCurrentSpecification("");
        }
    };

    // Handle removing specifications
    const removeSpecification = (index) => {
        const newSpecifications = productDetails.specifications.filter((_, i) => i !== index);
        setproductDetails({
            ...productDetails,
            specifications: newSpecifications
        });
    };

    // Handle adding tags
    const addTag = () => {
        if (currentTag.trim()) {
            setproductDetails({
                ...productDetails,
                tags: [...productDetails.tags, currentTag.trim()]
            });
            setCurrentTag("");
        }
    };

    // Handle removing tags
    const removeTag = (index) => {
        const newTags = productDetails.tags.filter((_, i) => i !== index);
        setproductDetails({
            ...productDetails,
            tags: newTags
        });
    };

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
            let product = {
                ...productDetails,
                rating: parseFloat(productDetails.rating) || 0,
            };

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
                        subcategory:"",
                        new_price:"",
                        old_price:"",
                        description:"",
                        rating:"0",
                        specifications:[],
                        tags:[],
                        inStock:true
                    });
                    setimage(false);
                    setCurrentSpecification("");
                    setCurrentTag("");
                    
                    // Close modal if callback provided
                    if (onProductAdded) {
                        onProductAdded();
                    }
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

        <div className="addproduct-itemfeild">
            <p>Product Description</p>
            <textarea 
                value={productDetails.description} 
                onChange={changeHandler} 
                name='description' 
                placeholder='Enter detailed product description (max 1000 characters)' 
                rows="4"
                maxLength="1000"
            />
            <small>{productDetails.description.length}/1000 characters</small>
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

        <div className="addproduct-price">
            <div className="addproduct-itemfeild">
                <p>Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Decorative">Decorative</option>
                </select>
            </div>
            <div className="addproduct-itemfeild">
                <p>Subcategory</p>
                <input 
                    value={productDetails.subcategory} 
                    onChange={changeHandler} 
                    type="text" 
                    name='subcategory' 
                    placeholder='Enter subcategory (optional)' 
                />
            </div>
        </div>

        <div className="addproduct-price">
            <div className="addproduct-itemfeild">
                <p>Rating (0-5)</p>
                <input 
                    value={productDetails.rating} 
                    onChange={changeHandler} 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="5"
                    name='rating' 
                    placeholder='Product rating' 
                />
            </div>
        </div>

        {/* Specifications Section */}
        <div className="addproduct-itemfeild">
            <p>Product Specifications</p>
            <div className="size-input-container">
                <input 
                    value={currentSpecification} 
                    onChange={(e) => setCurrentSpecification(e.target.value)}
                    type="text" 
                    placeholder='Enter specification (e.g., "72&quot; L x 36&quot; W x 30&quot; H", "Oak Wood", "Leather Upholstery")' 
                    onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
                />
                <button type="button" onClick={addSpecification} className="add-btn">Add Specification</button>
            </div>
            <div className="tags-display">
                {productDetails.specifications.map((specification, index) => (
                    <span key={index} className="tag-item">
                        {specification}
                        <button type="button" onClick={() => removeSpecification(index)} className="remove-tag">×</button>
                    </span>
                ))}
            </div>
        </div>

        {/* Tags Section */}
        <div className="addproduct-itemfeild">
            <p>Product Tags</p>
            <div className="size-input-container">
                <input 
                    value={currentTag} 
                    onChange={(e) => setCurrentTag(e.target.value)}
                    type="text" 
                    placeholder='Enter tag (e.g., "Solid Wood", "Modern Design")' 
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button type="button" onClick={addTag} className="add-btn">Add Tag</button>
            </div>
            <div className="tags-display">
                {productDetails.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)} className="remove-tag">×</button>
                    </span>
                ))}
            </div>
        </div>

        {/* Stock Status */}
        <div className="addproduct-itemfeild">
            <label className="checkbox-container">
                <input 
                    type="checkbox" 
                    name="inStock" 
                    checked={productDetails.inStock}
                    onChange={changeHandler}
                />
                <span className="checkmark"></span>
                Product is in stock
            </label>
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