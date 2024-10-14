
require("dotenv").config();
const port = process.env.PORT || 4000;//express server run due to this
// import dependency
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");//get access express with backend
const cors = require("cors");
const { type } = require("os");

app.use(express.json());//data pass as json code
const allowedOrigins = [
    'https://ferniture-webapp-frontend.onrender.com',
    'https://ferniture-webapp-admin.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const message = `CORS policy does not allow access from ${origin}`;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    methods: 'GET,POST,PUT,DELETE', // Specify methods allowed
    credentials: true // Allow credentials if necessary
}));

//initialized data base (create database connection with mongodb)
mongoose.connect(process.env.MONGO_DB_URL);

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

// Upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-backend.onrender.com/images/' 
        : `http://localhost:${port}/images/`;

    res.json({
        success: 1,
        Image_url: `${baseUrl}${req.file.filename}`,
    });
});

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


app.post('/addproduct',async(req,res)=>{//API add product
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

//API delete product
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Remove");
    res.json({
        success:true,
        name:req.body.name
    })
})  

//API get all product
app.get('/alllprducts',async(req,res)=>{
    let product = await Product.find({});
    console.log("All Product Fetched");
    res.send(product);
})

//schema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Endpoint for regresting user
app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i=0; i<300;i++){
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    //jwt authentication
    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json ({success:true,token})
})

//Enpoint for user loging
app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user :{
                    id:user.id
                }
            }
            const token =jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrog Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email"});
    }
})

//endpoint for newcollection
app.get('/newcollection',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollction Fetched");
    res.send(newcollection);
})

//creating middleware to fetch user dor cartitem
    const fetchuser = async(req,res,next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try{
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            }catch(error){
                res.status(401).send({errors:"Please authenticate using valid token"})
            }
        }
    }

//endpoint for cart
app.post('/addtocart',fetchuser,async(req,res)=>{
    // console.log(req.body,req.user);
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");

})

//remove cart
app.post('/removefromcart',fetchuser,async(req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");

})

//get cart data
app.post('/getcart',fetchuser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Sever Running "+port)
    }
    else{
        console.log("Error : " +error)
    }
})