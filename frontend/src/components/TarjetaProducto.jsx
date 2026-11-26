import { Link } from 'react-router-dom'

import imagenes from '../data/imagenes.js'
import { dinero } from '../data/operaciones.js'

const nombresCategorias = {
  ascensores: 'Ascensores',
  camiones: 'Camiones',
  herramientas: 'Herramientas',
  indumentaria: 'Indumentaria',
  andamios: 'Andamios',
}

const etiquetasComerciales = {
  'ASC-2T': 'Elevación de carga',
  'ASC-1T': 'Espacios industriales',
  'CAM-20T': 'Movimiento de tierra',
  'CAM-12T': 'Transporte de material',
  'HERR-18V': 'Perforación y montaje',
  'HERR-20V': 'Trabajo en obra',
  'IND-CASCO-AMARILLO': 'Protección personal',
  'IND-CASCO-SUPERVISOR': 'Equipamiento de faena',
  'AND-MOD-2X1': 'Trabajo en altura',
}

function etiquetaDe(nombre) {
  return String(nombre ?? '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letra) => letra.toUpperCase())
}

function resumenAtributos(producto) {
  const atributos = producto.atributos ?? {}
  if (atributos && typeof atributos === 'object') {
    const partes = Object.entries(atributos)
      .filter(([, valor]) => {
        if (valor === undefined || valor === null) return false
        if (typeof valor === 'string' && valor.trim() === '') return false
        if (valor === false) return false
        return true
      })
      .slice(0, 3)
      .map(([clave, valor]) =>
        `${etiquetaDe(clave)}: ${typeof valor === 'boolean' ? 'Sí' : valor}`
      )
    if (partes.length > 0) return partes.join(' · ')
  }

  const heredados = [producto.tonelaje, producto.tamano].filter(
    (valor) => valor && valor !== 'No aplica'
  )
  return heredados.join(' · ')
}

export default function TarjetaProducto({ producto, onAgregar }) {
  const precioAnterior = Number(producto.precioAnterior ?? 0)
  const atributos = resumenAtributos(producto)

  return (
    <article className="product-card">
      <Link className="product-image" to={`/producto/${producto.id}`}>
        <img
          src={imagenes[String(producto.imagen ?? '').replace(/\.jpg$/i, '')] || imagenes.obra}
          alt={`Imagen referencial: ${producto.nombre}`}
          loading="lazy"
        />

        <span className="product-category">
          {nombresCategorias[producto.categoria] ?? producto.categoria}
        </span>
      </Link>

      <div className="product-body">
        <span className="muted-label">{producto.etiqueta ?? etiquetasComerciales[producto.codigo] ?? 'Equipamiento de obra'}</span>

        <h3>
          <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
        </h3>

        {atributos && <p className="product-meta">{atributos}</p>}

        {precioAnterior > Number(producto.precio) && (
          <span className="oferta-label">
            Oferta · Antes {dinero(precioAnterior)}
          </span>
        )}

        <div className="product-price">
          {dinero(producto.precio)}
          <small>IVA incluido · Precio referencial</small>
        </div>

        <div className="product-actions">
          <Link
            className="btn btn-outline-primary"
            to={`/producto/${producto.id}`}
          >
            Ver detalle
          </Link>

          <button
            type="button"
            className="btn btn-primary"
            disabled={producto.stock < 1 || producto.activo === false || !onAgregar}
            onClick={() => onAgregar(producto.id, 1)}
          >
            {producto.stock > 0 && producto.activo !== false
              ? '+ Agregar'
              : 'Sin stock'}
          </button>
        </div>
      </div>
    </article>
  )
}
