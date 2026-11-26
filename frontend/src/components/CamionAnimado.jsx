
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import camion from '../assets/img/camion-envio.png'

gsap.registerPlugin(useGSAP)

const formatoCLP = (valor) =>
    new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    }).format(valor)

function CamionAnimado() {
    const seccionRef = useRef(null)
    const camionRef = useRef(null)

    const [subtotal, setSubtotal] = useState('')
    const [tipoEntrega, setTipoEntrega] = useState('DESPACHO')
    const [resultado, setResultado] = useState(null)


    const calcularDespacho = (evento) => {
        evento.preventDefault()

        const valor = Number(subtotal)

        if (
            subtotal.trim() === '' ||
            !Number.isSafeInteger(valor) ||
            valor <= 0
        ) {
            setResultado(null)
            return
        }

        const costoDespacho =
            tipoEntrega === 'RETIRO'
                ? 0
                : valor < 1000000
                    ? 50000
                    : 100000

        setResultado({
            subtotal: valor,
            despacho: costoDespacho,
            total: valor + costoDespacho,
            tipoEntrega
        })
    }
    useGSAP(() => {
        if (
            !resultado ||
            resultado.tipoEntrega !== 'DESPACHO' ||
            !camionRef.current
        ) {
            return
        }

        const camionElemento = camionRef.current
        const carretera = camionElemento.parentElement

        gsap.fromTo(
            camionElemento,
            {
                x: -carretera.clientWidth,
                autoAlpha: 1
            },
            {
                x: 0,
                autoAlpha: 1,
                duration: 3,
                ease: 'power2.out'
            }
        )
    }, {
        scope: seccionRef,
        dependencies: [resultado],
        revertOnUpdate: true
    })

    return (
        <section
            className="camion-seccion"
            ref={seccionRef}
        >
            <div className="container">

                <span className="eyebrow">
                    Opciones de entrega
                </span>

                <h2>Calcula el despacho de tu maquinaria</h2>

                <p>
                    Cotiza el transporte de tus equipos dentro de la
                    Región Metropolitana o selecciona retiro gratuito.
                </p>

                <form onSubmit={calcularDespacho}>
                    <div className="row g-3">

                        <div className="col-md-5">
                            <label
                                htmlFor="subtotal-despacho"
                                className="form-label"
                            >
                                Subtotal de productos
                            </label>

                            <input
                                id="subtotal-despacho"
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                value={subtotal}
                                onChange={(e) => {
                                    setSubtotal(e.target.value)
                                    setResultado(null)
                                }}
                                placeholder="Ej. 850000"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label
                                htmlFor="tipo-despacho"
                                className="form-label"
                            >
                                Modalidad de entrega
                            </label>

                            <select
                                id="tipo-despacho"
                                className="form-select"
                                value={tipoEntrega}
                                onChange={(e) => {
                                    setTipoEntrega(e.target.value)
                                    setResultado(null)
                                }}
                            >
                                <option value="DESPACHO">
                                    Despacho en la RM
                                </option>

                                <option value="RETIRO">
                                    Retiro gratuito
                                </option>
                            </select>
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                type="submit"
                                className="btn btn-accent w-100"
                            >
                                Calcular despacho
                            </button>
                        </div>

                    </div>
                </form>

                {resultado && (
                    <div className="camion-resultado mt-4">
                        <p>
                            Subtotal: {formatoCLP(resultado.subtotal)}
                        </p>

                        <p>
                            Entrega: {formatoCLP(resultado.despacho)}
                        </p>

                        <h3>
                            Total estimado: {formatoCLP(resultado.total)}
                        </h3>

                        <Link to="/catalogo">
                            Explorar productos →
                        </Link>
                    </div>
                )}

                {resultado?.tipoEntrega === 'DESPACHO' && (
                    <div className="camion-pista">
                        <div className="camion-carretera">

                            <span className="camion-origen">
                                INMAQUI
                            </span>

                            <span className="camion-destino">
                                <span aria-hidden="true">📍</span>
                                Destino: Región Metropolitana
                            </span>

                            <div ref={camionRef} className="camion-vehiculo">
                                <img
                                    src={camion}
                                    className="camion-animado"
                                    alt="Camión de transporte de maquinaria"
                                    draggable="false"
                                />
                            </div>

                        </div>
                    </div>
                )}

                <p className="camion-nota">
                    Despacho disponible solo en la Región Metropolitana.
                    Valores referenciales. El precio definitivo se
                    confirma al comprar.
                </p>

            </div>
        </section>
    )
}

export default CamionAnimado
