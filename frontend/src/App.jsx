import { useState } from 'react'
import Header from './components/Header'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {


  return (
    <>
    <Header />
    
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo />} />
    </Routes>
  
      
    </>
  )
}

export default App
