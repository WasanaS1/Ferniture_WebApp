
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';  
import LoginSingup from './Pages/LoginSingup';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/Kitchen' element={<ShopCategory category="Kitchen"/>}/>
          <Route path='/Leving area' element={<ShopCategory category="Leving area"/>}/>
          <Route path='/Room' element={<ShopCategory category="Room"/>}/>
          <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSingup/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
