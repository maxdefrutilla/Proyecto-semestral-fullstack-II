import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Detalle from './pages/Detalle.jsx'



function App() {


  return (
    <>
    <Header />
    
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/producto/:id" element={<Detalle />} />
    </Routes>
  
      
    </>
  )
}

export default App
