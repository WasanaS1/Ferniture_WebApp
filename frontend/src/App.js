
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Furniture from './Pages/Furniture';
import FurnitureCategory from './Pages/FurnitureCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';  
import LoginSingup from './Pages/LoginSingup';
import Footer from './Components/Footer/Footer';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Furniture/>}/>

          <Route path='/Indoor' element={<FurnitureCategory category="Indoor"/>}/>
          <Route path='/Outdoor' element={<FurnitureCategory category="Outdoor"/>}/>
          <Route path='/Decorative' element={<FurnitureCategory category="Decorative"/>}/>
          
          <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSingup/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
