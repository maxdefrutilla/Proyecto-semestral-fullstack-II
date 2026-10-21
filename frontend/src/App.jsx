import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import productosIniciales from './data/productos.json'
import categoriasIniciales from './data/categorias.json'
import usuariosIniciales from './data/usuarios.json'
import {
  crearRegistro,
  editarRegistro,
  eliminarRegistro,
} from './data/operaciones'
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Categorias from './pages/Categorias'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Blog from './pages/Blog'
import Acceso from './pages/Acceso'
import Administracion from './pages/Administracion'
import './App.css'

function App() {
  // Estado compartido de la tienda. Vive aca y se entrega por props
  // a las paginas que lo necesitan (admin, acceso y categorias).
  const [productos, setProductos] = useState(productosIniciales)
  const [categorias, setCategorias] = useState(categoriasIniciales)
  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [usuario, setUsuario] = useState(null)
  const [pedidos] = useState([])

  function guardarProducto(producto, nuevo) {
    if (nuevo) setProductos(crearRegistro(productos, producto))
    else setProductos(editarRegistro(productos, producto))
  }

  function eliminarProducto(id) {
    setProductos(eliminarRegistro(productos, id))
  }

  function guardarCategoria(categoria, nuevo) {
    if (nuevo) setCategorias(crearRegistro(categorias, categoria))
    else setCategorias(editarRegistro(categorias, categoria))
  }

  function eliminarCategoria(id) {
    if (categorias.length === 1) return 'Debe quedar al menos una categoria.'
    // Los productos guardan el codigo de la categoria, no su id.
    let codigo = ''
    for (let i = 0; i < categorias.length; i++)
      if (categorias[i].id === id) codigo = categorias[i].codigo
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].categoria === codigo)
        return 'No se puede eliminar: tiene productos asociados.'
    }
    setCategorias(eliminarRegistro(categorias, id))
    return 'Categoria eliminada.'
  }

  function guardarUsuario(cuenta, nuevo) {
    if (nuevo) setUsuarios(crearRegistro(usuarios, cuenta))
    else setUsuarios(editarRegistro(usuarios, cuenta))
    // Si el administrador edita su propia cuenta, la sesion se actualiza.
    if (!nuevo && usuario && usuario.id === cuenta.id) setUsuario(cuenta)
  }

  function eliminarUsuario(id) {
    if (usuario && id === usuario.id) return
    setUsuarios(eliminarRegistro(usuarios, id))
  }

  return (
    <>
      <Header usuario={usuario} />

      <main id="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          {/* Esta ruta la completara el catalogo comercial del equipo. */}
          <Route path="/categoria/:id" element={<Catalogo />} />
          <Route path="/categorias" element={<Categorias categorias={categorias} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/elegir-equipo" element={<Blog articulo={1} />} />
          <Route
            path="/blog/planificar-arriendo"
            element={<Blog articulo={2} />}
          />
          <Route
            path="/acceso"
            element={
              <Acceso
                usuarios={usuarios}
                usuario={usuario}
                ingresar={setUsuario}
                salir={function () {
                  setUsuario(null)
                }}
                registrar={function (cuenta) {
                  guardarUsuario(cuenta, true)
                }}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <Administracion
                usuario={usuario}
                usuarios={usuarios}
                productos={productos}
                categorias={categorias}
                pedidos={pedidos}
                guardarProducto={guardarProducto}
                eliminarProducto={eliminarProducto}
                guardarCategoria={guardarCategoria}
                eliminarCategoria={eliminarCategoria}
                guardarUsuario={guardarUsuario}
                eliminarUsuario={eliminarUsuario}
              />
            }
          />
          <Route
            path="*"
            element={
              <section className="section">
                <div className="container empty-state">
                  <h1 className="fs-2">No encontramos esta pagina.</h1>
                  <Link to="/catalogo">Volver al catalogo</Link>
                </div>
              </section>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
