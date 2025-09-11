// API Configuration for Admin Panel
const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://ferniture-webapp-backend.onrender.com'
    : 'http://localhost:4000',
    
  ENDPOINTS: {
    UPLOAD: '/upload',
    ADD_PRODUCT: '/addproduct',
    ALL_PRODUCTS: '/allproducts',
    REMOVE_PRODUCT: '/removeproduct'
  }
};

export default API_CONFIG;
