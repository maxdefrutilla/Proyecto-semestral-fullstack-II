import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import mastil from '../assets/img/mastil_ascensor.png'
import plataforma from '../assets/img/plataforma_ascensor.png'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function AscensorScroll() {
  const contenedorRef = useRef(null)
  const plataformaRef = useRef(null)
  const { pathname } = useLocation()



useGSAP(() => {
  const contenedor = contenedorRef.current
  const plataforma = plataformaRef.current

  if (!contenedor || !plataforma) return

  gsap.fromTo(
    plataforma,
    {
      y: 0
    },
    {
      y: () => {
        const alturaMastil = contenedor.clientHeight
        const alturaPlataforma = plataforma.offsetHeight

        const recorrido = Math.max(
          0,
          alturaMastil - alturaPlataforma - 64
        )

        return -recorrido
      },

      ease: 'none',

      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    }
  )

  ScrollTrigger.refresh()
}, {
  scope: contenedorRef,
  dependencies: [pathname],
  revertOnUpdate: true
})



  return (
    <div
      ref={contenedorRef}
      className="ascensor-scroll"
      aria-hidden="true"
    >
      <img
        src={mastil}
        alt=""
        className="ascensor-mastil"
        draggable="false"
      />

      <img
        ref={plataformaRef}
        src={plataforma}
        alt=""
        className="ascensor-plataforma"
        draggable="false"
      />
    </div>
  )
}

export default AscensorScroll
