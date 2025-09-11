import React from 'react'
import Navbar from './Components/navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import Footer from './Components/Footer/Footer'
import './App.css'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Admin />
      <Footer />
    </div>
  )
}

export default App