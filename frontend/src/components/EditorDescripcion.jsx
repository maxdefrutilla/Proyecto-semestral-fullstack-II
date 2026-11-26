import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { sanitizarHtml } from '../utils/html.js'

function Boton({ etiqueta, titulo, activo = false, onClick }) {
  return (
    <button
      type="button"
      className={'btn btn-sm ' + (activo ? 'btn-primary' : 'btn-outline-secondary')}
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      onMouseDown={(evento) => evento.preventDefault()}
      onClick={onClick}
    >
      {etiqueta}
    </button>
  )
}

export default function EditorDescripcion({
  valor = '',
  cambiar,
  id = 'editorDescripcion',
  soloLectura = false,
}) {
  const ultimoCambio = useRef(null)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
        },
      }),
    ],
    content: sanitizarHtml(valor),
    editable: !soloLectura,
    editorProps: {
      attributes: {
        id,
        class: 'form-control editor-contenido',
        role: 'textbox',
        'aria-label': 'Descripción con formato',
      },
    },
    onUpdate: ({ editor: instancia }) => {
      const contenido = sanitizarHtml(instancia.getHTML())
      ultimoCambio.current = contenido
      cambiar?.(contenido)
    },
  })

  useEffect(() => {
    if (!editor) return
    const limpio = sanitizarHtml(valor)
    if (limpio === ultimoCambio.current) return
    if (limpio !== sanitizarHtml(editor.getHTML())) {
      ultimoCambio.current = null
      editor.commands.setContent(limpio, { emitUpdate: false })
    }
  }, [valor, editor])

  if (!editor) return null

  function agregarEnlace() {
    const anterior = editor.getAttributes('link').href ?? ''
    const respuesta = window.prompt('URL del enlace (http o https):', anterior || 'https://')
    if (respuesta === null) return
    if (!respuesta.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    if (!/^https?:\/\//i.test(respuesta.trim())) {
      window.alert('Solo se permiten enlaces http o https.')
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: respuesta.trim() }).run()
  }

  return (
    <div className="editor-descripcion">
      {!soloLectura && (
        <div className="btn-toolbar flex-wrap gap-1 mb-2" role="toolbar" aria-label="Formato de la descripción">
          <Boton etiqueta="B" titulo="Negrita" activo={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
          <Boton etiqueta="I" titulo="Cursiva" activo={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <Boton etiqueta="H1" titulo="Título 1" activo={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
          <Boton etiqueta="H2" titulo="Título 2" activo={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <Boton etiqueta="• Lista" titulo="Lista con viñetas" activo={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <Boton etiqueta="1. Lista" titulo="Lista numerada" activo={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
          <Boton etiqueta="Link" titulo="Agregar enlace" activo={editor.isActive('link')} onClick={agregarEnlace} />
        </div>
      )}
      <EditorContent editor={editor} />
      <p className="form-text">
        Puedes usar negrita, cursiva, títulos, listas y enlaces http/https.
      </p>
    </div>
  )
}
