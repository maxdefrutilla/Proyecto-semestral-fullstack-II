import DOMPurify from 'dompurify'

const configuracion = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'span', 'div'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'title'],
  ALLOW_DATA_ATTR: false,
}

if (DOMPurify?.addHook) {
  DOMPurify.addHook('afterSanitizeAttributes', (nodo) => {
    if (nodo.tagName === 'A' && nodo.getAttribute('href')) {
      nodo.setAttribute('target', '_blank')
      nodo.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

// El backend sanitiza al guardar; el frontend vuelve a sanitizar al renderizar.
export function sanitizarHtml(html = '') {
  if (!html) return ''
  return DOMPurify.sanitize(String(html), configuracion)
}

export function textoDeHtml(html = '') {
  if (!html) return ''
  if (typeof document !== 'undefined' && document.createElement) {
    const contenedor = document.createElement('div')
    contenedor.innerHTML = sanitizarHtml(html)
    return (contenedor.textContent || '').trim()
  }
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
}
