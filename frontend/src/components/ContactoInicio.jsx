
import { Link } from 'react-router-dom'

function ContactoInicio() {
  return (
    <section className="contact-band">
      <div className="container">
        <div>
          <h2>Conversemos sobre tu obra.</h2>
          <p className="mb-0">
            Cuéntanos qué necesitas y revisemos las alternativas.
          </p>
        </div>

        <Link className="btn btn-accent" to="/contacto">
          Dejar mis datos →
        </Link>
      </div>
    </section>
  )
}

export default ContactoInicio
