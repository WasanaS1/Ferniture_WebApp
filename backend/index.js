const port = 4000;//express server run due to this
// import dependency
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");//get access express with backend
const cors = require("cors");

app.use(express.json());//data pass as json code
app.use(cors());//connect express using 4000 port

//initialized data base (create database connection with mongodb)
mongoose.connect("mongodb+srv://wishyCode:1234@cluster0.bewpwrl.mongodb.net/e-commerce");

//API creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//API to store images

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{//generate image file name
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating upload Endpoint for images

app.use('/images',express.static('upload/images'))//to provide image url.(mount images endpoint)

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        Image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for product to mongoose

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})


app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});//get product inn array
    let id;
    if (products.length>0){
        let last_product_array =  products.slice(-1);//get last product
        let last_product = last_product_array[0];
        id = last_product.id+1;//generate new id
    }
    else{
        id=1;
    }
    //use schema for add product to our data base
    const product = new Product({
        id:id,//get above generated id
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    //generate response for frontend
    res.json({
        success:true,
        name:req.body.name,    
    })
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Sever Running "+port)
    }
    else{
        console.log("Error : " +error)
    }
})