
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Furniture from './Pages/Furniture';
import FurnitureCategory from './Pages/FurnitureCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';  
import LoginSingup from './Pages/LoginSingup';
import AllProducts from './Pages/AllProducts';
import Footer from './Components/Footer/Footer';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import indoor_banner from './Components/Assests/banner_indoor.jpeg'
import outdoor_banner from './Components/Assests/banner_outdoor.jpeg'
import deco_banner from './Components/Assests/banner_deco.jpeg'

function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar/>
        <Routes>
          <Route path='/' element={<AllProducts/>}/>
          <Route path='/furniture' element={<Furniture/>}/>

          <Route path='/Indoor' element={<FurnitureCategory banner={indoor_banner} category="Indoor"/>}/>
          <Route path='/Outdoor' element={<FurnitureCategory banner={outdoor_banner} category="Outdoor"/>}/>
          <Route path='/Decorative' element={<FurnitureCategory banner={deco_banner} category="Decorative"/>}/>
          
          <Route path='/product/:productId' element={<Product/>}/>
        
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSingup/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
