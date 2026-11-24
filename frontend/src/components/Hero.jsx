import { useEffect, useRef } from 'react'
import { Carousel } from 'bootstrap'
import { Link } from 'react-router-dom'

import imagenObra from '../assets/img/obra.jpg'
import imagenCamiones from '../assets/img/camiones.jpg'

function Hero() {
  const carruselRef = useRef(null)

  useEffect(() => {
    const elemento = carruselRef.current
    if (!elemento) return

    // Un solo temporizador controla la rotación desde el primer montaje.
    const carrusel = Carousel.getOrCreateInstance(elemento, {
      interval: false,
      ride: false,
      pause: false,
      touch: true
    })

    const intervalo = window.setInterval(() => {
      carrusel.next()
    }, 5000)

    return () => {
      window.clearInterval(intervalo)
      carrusel.dispose()
    }
  }, [])
  return (
    <section
        ref={carruselRef}
        id="portada"
        className="hero carousel slide carousel-fade"
        aria-label="Destacados de INMAQUI"
    >
      <div className="carousel-inner">

        {/* PRIMERA DIAPOSITIVA */}
        <div className="carousel-item active">
          <img
            className="hero-image"
            src={imagenObra}
            alt="Grúa trabajando en una obra"
          />

          <div className="hero-shade"></div>

          <div className="container">
            <div className="hero-copy">
              <span className="eyebrow">
                Equipamos el trabajo en terreno
              </span>

              <h1>
                Tu próxima obra.
                <br />
                Nuestro <em>equipo.</em>
              </h1>

              <p>
                Encuentra maquinaria, herramientas y protección
                para llevar tu proyecto del plano a la realidad.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <Link className="btn btn-accent" to="/catalogo">
                  Explorar catálogo →
                </Link>

                <Link className="btn btn-outline-light" to="/arriendos">
                  Quiero arrendar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEGUNDA DIAPOSITIVA */}
        <div className="carousel-item">
          <img
            className="hero-image"
            src={imagenCamiones}
            alt="Camión tolva en una faena"
            loading="lazy"
          />

          <div className="hero-shade"></div>

          <div className="container">
            <div className="hero-copy">
              <span className="eyebrow">
                Arriendo y servicios
              </span>

              <h1>
                El equipo justo.
                <br />
                El tiempo <em>necesario.</em>
              </h1>

              <p>
                Arriendos por hora, día o mes.
                Conoce las alternativas para tu próxima obra.
              </p>

              <Link className="btn btn-accent" to="/arriendos">
                Ver planes de arriendo →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLES DEL CARRUSEL */}
      <div className="hero-controls container">
        <button
          type="button"
          data-bs-target="#portada"
          data-bs-slide="prev"
          aria-label="Diapositiva anterior"
        >
          ←
        </button>

        <button
          type="button"
          data-bs-target="#portada"
          data-bs-slide="next"
          aria-label="Diapositiva siguiente"
        >
          →
        </button>

        <span className="slide-label">
          INMAQUI / EN TERRENO
        </span>

        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#portada"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Ver catálogo"
          ></button>

          <button
            type="button"
            data-bs-target="#portada"
            data-bs-slide-to="1"
            aria-label="Ver arriendos"
          ></button>
        </div>
      </div>
    </section>
  )
}

export default Hero