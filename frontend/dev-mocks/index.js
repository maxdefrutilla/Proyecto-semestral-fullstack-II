import { validarRut } from '../src/data/operaciones.js'
import { esComunaRM } from '../src/data/comunas.js'
import { categoriasIniciales, productosIniciales, usuariosIniciales } from './datos.js'

const PREFIJO = '/api/v1'
const clonar = (valor) => JSON.parse(JSON.stringify(valor))

function crearEstado(claves) {
  return {
    productos: clonar(productosIniciales),
    categorias: clonar(categoriasIniciales).map((categoria) => ({
      ...categoria,
      tipoAtributos: {
        ascensores: 'ASCENSOR', camiones: 'CAMION', herramientas: 'HERRAMIENTA',
        indumentaria: 'INDUMENTARIA', andamios: 'ANDAMIO',
      }[categoria.codigo],
    })),
    usuarios: clonar(usuariosIniciales).map((cuenta) => ({ ...cuenta, clave: claves[cuenta.usuario] })),
    pedidos: [],
    consecutivo: 1,
  }
}

function enviar(res, status, datos) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(datos))
}

async function leerCuerpo(req) {
  let texto = ''
  for await (const parte of req) {
    texto += parte
    if (texto.length > 1_000_000) throw new Error('Cuerpo demasiado grande')
  }
  if (!texto) return {}
  try {
    return JSON.parse(texto)
  } catch {
    return {}
  }
}

function limpiarHtml(valor = '') {
  return String(valor)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

function slug(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function publico(usuario) {
  const seguro = { ...usuario }
  delete seguro.clave
  return seguro
}

function usuarioDeToken(req, estado) {
  const cabecera = String(req.headers.authorization ?? '')
  if (!cabecera.startsWith('Bearer ')) return null
  const token = cabecera.slice(7)
  if (!token.startsWith('mock-jwt-')) return null
  const id = Number(token.slice('mock-jwt-'.length))
  return estado.usuarios.find(
    (usuario) => usuario.id === id && usuario.activo !== false
  ) ?? null
}

function requerirUsuario(req, res, estado) {
  const usuario = usuarioDeToken(req, estado)
  if (!usuario) {
    enviar(res, 401, { mensaje: 'Debes iniciar sesión para continuar.' })
    return null
  }
  return usuario
}

function requerirAdmin(req, res, estado) {
  const usuario = requerirUsuario(req, res, estado)
  if (!usuario) return null
  if (usuario.rol !== 'ADMINISTRADOR') {
    enviar(res, 403, { mensaje: 'No tienes permisos para realizar esta acción.' })
    return null
  }
  return usuario
}

function buscarPorId(lista, id) {
  return lista.find((registro) => String(registro.id) === String(id)) ?? null
}

function siguienteId(lista) {
  return lista.reduce((mayor, registro) => Math.max(mayor, Number(registro.id) || 0), 0) + 1
}

function normalizarTipoAtributos(valor) {
  return String(valor ?? '')
}

async function atender(req, res, estado, url) {
  const ruta = url.pathname
  const metodo = req.method

  // ---------- Autenticación ----------
  if (ruta === '/auth/login' && metodo === 'POST') {
    const cuerpo = await leerCuerpo(req)
    const identificador = String(cuerpo.usuario ?? '').trim().toLowerCase()
    const encontrado = estado.usuarios.find(
      (usuario) =>
        usuario.activo !== false &&
        (String(usuario.usuario).toLowerCase() === identificador ||
          String(usuario.correo).toLowerCase() === identificador)
    )
    if (!encontrado?.clave || encontrado.clave !== cuerpo.password) {
      enviar(res, 401, { mensaje: 'Usuario o contraseña incorrectos.' })
      return
    }
    enviar(res, 200, {
      token: `mock-jwt-${encontrado.id}`,
      usuario: publico(encontrado),
    })
    return
  }

  if (ruta === '/auth/registro' && metodo === 'POST') {
    const cuerpo = await leerCuerpo(req)
    const nombre = String(cuerpo.nombre ?? '').trim()
    const apellidos = String(cuerpo.apellidos ?? '').trim()
    const usuario = String(cuerpo.usuario ?? '').trim().toLowerCase()
    const rut = String(cuerpo.rut ?? '').trim()
    const correo = String(cuerpo.correo ?? '').trim().toLowerCase()

    if (!nombre || !apellidos || !usuario || !rut || !correo || !cuerpo.password) {
      enviar(res, 400, { mensaje: 'Completa todos los campos obligatorios.' })
      return
    }
    if (!validarRut(rut)) {
      enviar(res, 400, { mensaje: 'Ingresa un RUT válido.' })
      return
    }
    const duplicado = estado.usuarios.find(
      (registro) =>
        String(registro.usuario).toLowerCase() === usuario ||
        String(registro.correo).toLowerCase() === correo ||
        String(registro.rut).replace(/\./g, '') === rut.replace(/\./g, '')
    )
    if (duplicado) {
      enviar(res, 409, { mensaje: 'El usuario, correo o RUT ya está registrado.' })
      return
    }

    const nuevo = {
      id: siguienteId(estado.usuarios),
      nombre,
      apellidos,
      usuario,
      rut,
      correo,
      clave: cuerpo.password,
      rol: 'CLIENTE',
      direccion: '',
      comuna: '',
      telefono: String(cuerpo.telefono ?? ''),
      activo: true,
    }
    estado.usuarios.push(nuevo)
    enviar(res, 201, { usuario: publico(nuevo) })
    return
  }

  if (ruta === '/auth/logout' && metodo === 'POST') {
    res.statusCode = 204
    res.end()
    return
  }

  if (ruta === '/auth/refresh' && metodo === 'POST') {
    enviar(res, 401, { mensaje: 'Sesión no disponible.' })
    return
  }

  // ---------- Perfil y usuarios (administración) ----------
  if (ruta === '/usuarios/me' && metodo === 'GET') {
    const usuario = requerirUsuario(req, res, estado)
    if (usuario) enviar(res, 200, publico(usuario))
    return
  }

  if (ruta === '/usuarios/me' && metodo === 'PUT') {
    const usuario = requerirUsuario(req, res, estado)
    if (!usuario) return
    const cuerpo = await leerCuerpo(req)
    const rut = String(cuerpo.rut ?? usuario.rut).trim()
    const correo = String(cuerpo.correo ?? usuario.correo).trim().toLowerCase()
    if (!validarRut(rut)) {
      enviar(res, 400, { mensaje: 'Ingresa un RUT válido.' })
      return
    }
    const duplicado = estado.usuarios.find(
      (registro) =>
        registro.id !== usuario.id &&
        (String(registro.correo).toLowerCase() === correo ||
          String(registro.rut).replace(/\./g, '') === rut.replace(/\./g, ''))
    )
    if (duplicado) {
      enviar(res, 409, { mensaje: 'El correo o RUT ya está registrado.' })
      return
    }
    Object.assign(usuario, {
      nombre: String(cuerpo.nombre ?? usuario.nombre).trim() || usuario.nombre,
      apellidos: String(cuerpo.apellidos ?? usuario.apellidos).trim(),
      rut,
      correo,
      direccion: String(cuerpo.direccion ?? usuario.direccion).trim(),
      comuna: String(cuerpo.comuna ?? usuario.comuna).trim(),
      telefono: String(cuerpo.telefono ?? usuario.telefono).trim(),
    })
    enviar(res, 200, publico(usuario))
    return
  }

  if (ruta === '/usuarios' && metodo === 'GET') {
    if (!requerirAdmin(req, res, estado)) return
    const incluir = url.searchParams.get('incluirInactivos') === 'true'
    enviar(res, 200, estado.usuarios
      .filter((usuario) => incluir || usuario.activo !== false)
      .map(publico))
    return
  }

  if (ruta === '/usuarios' && metodo === 'POST') {
    const administrador = requerirAdmin(req, res, estado)
    if (!administrador) return
    const cuerpo = await leerCuerpo(req)
    const usuario = String(cuerpo.usuario ?? '').trim().toLowerCase()
    const rut = String(cuerpo.rut ?? '').trim()
    const correo = String(cuerpo.correo ?? '').trim().toLowerCase()
    if (!usuario || !rut || !validarRut(rut) || !correo || !cuerpo.password) {
      enviar(res, 400, { mensaje: 'Revisa usuario, RUT, correo y contraseña.' })
      return
    }
    if (estado.usuarios.some((registro) =>
      String(registro.usuario).toLowerCase() === usuario ||
      String(registro.correo).toLowerCase() === correo ||
      String(registro.rut).replace(/\./g, '') === rut.replace(/\./g, ''))) {
      enviar(res, 409, { mensaje: 'El usuario, correo o RUT ya está registrado.' })
      return
    }
    const rol = String(cuerpo.rol ?? 'CLIENTE').toUpperCase() === 'ADMINISTRADOR'
      ? 'ADMINISTRADOR'
      : 'CLIENTE'
    const nuevo = {
      id: siguienteId(estado.usuarios),
      nombre: String(cuerpo.nombre ?? '').trim(),
      apellidos: String(cuerpo.apellidos ?? '').trim(),
      usuario,
      rut,
      correo,
      clave: cuerpo.password,
      rol,
      direccion: String(cuerpo.direccion ?? ''),
      comuna: String(cuerpo.comuna ?? ''),
      telefono: String(cuerpo.telefono ?? ''),
      activo: true,
    }
    estado.usuarios.push(nuevo)
    enviar(res, 201, publico(nuevo))
    return
  }

  const rutaUsuario = ruta.match(/^\/usuarios\/(\d+)(?:\/(rol|estado))?$/)
  if (rutaUsuario) {
    const administrador = requerirAdmin(req, res, estado)
    if (!administrador) return
    const usuario = buscarPorId(estado.usuarios, rutaUsuario[1])
    if (!usuario) {
      enviar(res, 404, { mensaje: 'Usuario no encontrado.' })
      return
    }
    if (metodo === 'PATCH' && rutaUsuario[2]) {
      const cuerpo = await leerCuerpo(req)
      if (rutaUsuario[2] === 'rol') usuario.rol = cuerpo.rol
      if (rutaUsuario[2] === 'estado') usuario.activo = cuerpo.activo
      enviar(res, 200, publico(usuario))
      return
    }
    if (metodo === 'PUT') {
      const cuerpo = await leerCuerpo(req)
      const rol = String(cuerpo.rol ?? usuario.rol).toUpperCase() === 'ADMINISTRADOR'
        ? 'ADMINISTRADOR'
        : 'CLIENTE'
      if (usuario.id === administrador.id && rol !== 'ADMINISTRADOR') {
        enviar(res, 400, { mensaje: 'No puedes quitarte el rol de administrador durante tu sesión.' })
        return
      }
      const rut = String(cuerpo.rut ?? usuario.rut).trim()
      if (!validarRut(rut)) {
        enviar(res, 400, { mensaje: 'Ingresa un RUT válido.' })
        return
      }
      Object.assign(usuario, {
        nombre: String(cuerpo.nombre ?? usuario.nombre).trim(),
        apellidos: String(cuerpo.apellidos ?? usuario.apellidos).trim(),
        usuario: String(cuerpo.usuario ?? usuario.usuario).trim().toLowerCase(),
        rut,
        correo: String(cuerpo.correo ?? usuario.correo).trim().toLowerCase(),
        rol,
        telefono: String(cuerpo.telefono ?? usuario.telefono).trim(),
        direccion: String(cuerpo.direccion ?? usuario.direccion).trim(),
        comuna: String(cuerpo.comuna ?? usuario.comuna).trim(),
        activo: cuerpo.activo === undefined ? usuario.activo !== false : Boolean(cuerpo.activo),
      })
      if (cuerpo.password) usuario.clave = cuerpo.password
      enviar(res, 200, publico(usuario))
      return
    }
    if (metodo === 'DELETE') {
      if (usuario.id === administrador.id) {
        enviar(res, 400, { mensaje: 'No puedes dar de baja tu propia cuenta activa.' })
        return
      }
      usuario.activo = false
      enviar(res, 200, { ok: true, id: usuario.id, activo: false })
      return
    }
  }

  // ---------- Categorías ----------
  const esRutaCategorias = ruta === '/categorias' || ruta === '/catalogo/categorias'
  if (esRutaCategorias) {
    if (metodo === 'GET') {
      const incluir = url.searchParams.get('incluirInactivos') === 'true'
      const administrador = usuarioDeToken(req, estado)
      const visible = incluir && administrador?.rol === 'ADMINISTRADOR'
      enviar(res, 200, estado.categorias.filter(
        (categoria) => visible || categoria.activo !== false
      ))
      return
    }
    if (metodo === 'POST') {
      if (!requerirAdmin(req, res, estado)) return
      const cuerpo = await leerCuerpo(req)
      const nombre = String(cuerpo.nombre ?? '').trim()
      const codigo = slug(cuerpo.codigo || nombre)
      if (!nombre || !codigo) {
        enviar(res, 400, { mensaje: 'Ingresa un nombre de categoría válido.' })
        return
      }
      if (estado.categorias.some((categoria) => categoria.codigo === codigo)) {
        enviar(res, 409, { mensaje: 'Ya existe una categoría con ese código.' })
        return
      }
      const nueva = {
        id: siguienteId(estado.categorias),
        nombre,
        codigo,
        descripcionHtml: limpiarHtml(cuerpo.descripcionHtml ?? ''),
        tipoAtributos: normalizarTipoAtributos(cuerpo.tipoAtributos),
        activo: true,
      }
      estado.categorias.push(nueva)
      enviar(res, 201, nueva)
      return
    }
  }

  const rutaCategoria = ruta.match(/^\/(?:categorias|catalogo\/categorias)\/(\d+)$/)
  if (rutaCategoria) {
    const categoria = buscarPorId(estado.categorias, rutaCategoria[1])
    if (!categoria) {
      enviar(res, 404, { mensaje: 'Categoría no encontrada.' })
      return
    }
    if (metodo === 'PUT') {
      if (!requerirAdmin(req, res, estado)) return
      const cuerpo = await leerCuerpo(req)
      Object.assign(categoria, {
        nombre: String(cuerpo.nombre ?? categoria.nombre).trim(),
        descripcionHtml: limpiarHtml(cuerpo.descripcionHtml ?? categoria.descripcionHtml),
        tipoAtributos: cuerpo.tipoAtributos === undefined
          ? categoria.tipoAtributos
          : normalizarTipoAtributos(cuerpo.tipoAtributos),
        activo: cuerpo.activo === undefined ? categoria.activo !== false : Boolean(cuerpo.activo),
      })
      enviar(res, 200, categoria)
      return
    }
    if (metodo === 'DELETE') {
      if (!requerirAdmin(req, res, estado)) return
      categoria.activo = false
      enviar(res, 200, { ok: true, id: categoria.id, activo: false })
      return
    }
  }

  // ---------- Calculadoras ----------
  if (ruta === '/catalogo/calculadoras/andamios' && metodo === 'POST') {
    const cuerpo = await leerCuerpo(req)
    const largo = Number(cuerpo.largoMetros ?? cuerpo.largo)
    const altura = Number(cuerpo.altoMetros ?? cuerpo.alturaMetros)
    if (!(largo > 0) || !(altura > 0)) {
      enviar(res, 400, { mensaje: 'Ingresa largo y altura mayores a cero.' })
      return
    }
    const andamio = estado.productos.find(
      (producto) => producto.categoria === 'andamios' && producto.activo !== false
    )
    if (!andamio) {
      enviar(res, 404, { mensaje: 'No hay un módulo de andamio disponible.' })
      return
    }
    if (cuerpo.productoId && String(cuerpo.productoId) !== String(andamio.id)) {
      enviar(res, 400, { mensaje: 'El producto indicado no corresponde al módulo de andamio.' })
      return
    }
    const ancho = Number(andamio.atributos?.anchoModuloMetros) || 2
    const alto = Number(andamio.atributos?.altoModuloMetros) || 2
    const cantidad = Math.ceil(largo / ancho) * Math.ceil(altura / alto)
    const suficiente = cantidad <= andamio.stock
    enviar(res, 200, {
      productoId: andamio.id,
      nombre: andamio.nombre,
      columnas: Math.ceil(largo / ancho),
      filas: Math.ceil(altura / alto),
      cantidad,
      precioUnitario: andamio.precio,
      subtotal: cantidad * andamio.precio,
      stockDisponible: andamio.stock,
      suficiente,
      aviso: 'Estimación comercial, requiere evaluación técnica.',
    })
    return
  }

  if (ruta === '/catalogo/calculadoras/ascensores' && metodo === 'POST') {
    const cuerpo = await leerCuerpo(req)
    const altura = Number(cuerpo.alturaMetros)
    const capacidad = Number(cuerpo.capacidadKg ?? cuerpo.capacidad)
    if (!(altura > 0) || !(capacidad > 0)) {
      enviar(res, 400, { mensaje: 'Ingresa altura y capacidad mayores a cero.' })
      return
    }
    const opciones = estado.productos
      .filter((producto) =>
        producto.categoria === 'ascensores' &&
        producto.activo !== false &&
        Number(producto.atributos?.capacidadKg ?? 0) >= capacidad &&
        Number(producto.atributos?.alturaMaxMetros ?? 0) >= altura)
    enviar(res, 200, opciones)
    return
  }

  // ---------- Productos ----------
  if (ruta === '/catalogo/productos') {
    if (metodo === 'GET') {
      const incluir = url.searchParams.get('incluirInactivos') === 'true'
      const administrador = usuarioDeToken(req, estado)
      const visible = incluir && administrador?.rol === 'ADMINISTRADOR'
      enviar(res, 200, estado.productos.filter(
        (producto) => visible || producto.activo !== false
      ))
      return
    }
    if (metodo === 'POST') {
      if (!requerirAdmin(req, res, estado)) return
      const cuerpo = await leerCuerpo(req)
      const producto = {
        id: siguienteId(estado.productos),
        nombre: String(cuerpo.nombre ?? '').trim(),
        categoria: buscarPorId(estado.categorias, cuerpo.categoriaId)?.codigo ?? '',
        precio: Number(cuerpo.precio ?? 0),
        stock: Number(cuerpo.stock ?? 0),
        imagen: cuerpo.imagen ?? 'obra.jpg',
        etiqueta: String(cuerpo.etiqueta ?? ''),
        descripcionHtml: limpiarHtml(cuerpo.descripcionHtml ?? ''),
        atributos: cuerpo.atributos && typeof cuerpo.atributos === 'object' ? cuerpo.atributos : {},
        oferta: Boolean(cuerpo.oferta),
        precioAnterior: Number(cuerpo.precioAnterior ?? 0),
        activo: true,
      }
      estado.productos.push(producto)
      enviar(res, 201, producto)
      return
    }
  }

  const rutaProducto = ruta.match(/^\/catalogo\/productos\/(\d+)$/)
  if (rutaProducto) {
    const producto = buscarPorId(estado.productos, rutaProducto[1])
    if (!producto || producto.activo === false) {
      enviar(res, 404, { mensaje: 'Producto no encontrado.' })
      return
    }
    if (metodo === 'GET') {
      enviar(res, 200, producto)
      return
    }
    if (metodo === 'PUT') {
      if (!requerirAdmin(req, res, estado)) return
      const cuerpo = await leerCuerpo(req)
      Object.assign(producto, {
        nombre: String(cuerpo.nombre ?? producto.nombre).trim(),
        categoria: buscarPorId(estado.categorias, cuerpo.categoriaId)?.codigo ?? producto.categoria,
        precio: Number(cuerpo.precio ?? producto.precio),
        stock: Number(cuerpo.stock ?? producto.stock),
        imagen: cuerpo.imagen ?? producto.imagen,
        etiqueta: String(cuerpo.etiqueta ?? producto.etiqueta),
        descripcionHtml: limpiarHtml(cuerpo.descripcionHtml ?? producto.descripcionHtml),
        atributos: cuerpo.atributos && typeof cuerpo.atributos === 'object'
          ? cuerpo.atributos
          : producto.atributos,
        oferta: cuerpo.oferta === undefined ? producto.oferta : Boolean(cuerpo.oferta),
        precioAnterior: cuerpo.precioAnterior ?? null,
        activo: cuerpo.activo === undefined ? producto.activo !== false : Boolean(cuerpo.activo),
      })
      enviar(res, 200, producto)
      return
    }
    if (metodo === 'DELETE') {
      if (!requerirAdmin(req, res, estado)) return
      producto.activo = false
      enviar(res, 200, { ok: true, id: producto.id, activo: false })
      return
    }
  }

  // ---------- Ventas ----------
  if (ruta === '/ventas/pedidos' && metodo === 'POST') {
    const cuerpo = await leerCuerpo(req)
    const comprador = cuerpo
    const nombre = String(comprador.nombre ?? '').trim()
    const apellidos = String(comprador.apellidos ?? '').trim()
    const rut = String(comprador.rut ?? '').trim()
    const correo = String(comprador.correo ?? '').trim()
    const tipoEntrega = String(cuerpo.tipoEntrega ?? cuerpo.entrega ?? '').toUpperCase()
    const direccion = String(cuerpo.direccion ?? '').trim()
    const comuna = String(cuerpo.comuna ?? '').trim()
    const claveOperacion = String(cuerpo.claveOperacion ?? '').trim()
    const resultado = String(cuerpo.resultadoPagoPrueba ?? '').toUpperCase()

    if (!nombre || !apellidos || !correo || !validarRut(rut)) {
      enviar(res, 400, { mensaje: 'Completa nombre, apellidos, RUT y correo válidos.' })
      return
    }
    if (!['RETIRO', 'DESPACHO'].includes(tipoEntrega)) {
      enviar(res, 400, { mensaje: 'Selecciona una modalidad de entrega válida.' })
      return
    }
    if (tipoEntrega === 'DESPACHO' && (direccion.length < 5 || !esComunaRM(comuna))) {
      enviar(res, 400, { mensaje: 'El despacho requiere dirección y una comuna de la RM.' })
      return
    }
    if (!claveOperacion) {
      enviar(res, 400, { mensaje: 'Falta la clave de operación.' })
      return
    }
    if (estado.pedidos.some((pedido) => pedido.claveOperacion === claveOperacion)) {
      enviar(res, 409, { mensaje: 'Esta operación ya fue procesada. Inicia un nuevo intento.' })
      return
    }
    if (!['APROBAR', 'RECHAZADO'].includes(resultado)) {
      enviar(res, 400, { mensaje: 'Selecciona el resultado de pago de prueba.' })
      return
    }

    const items = Array.isArray(cuerpo.items) ? cuerpo.items : []
    if (!items.length) {
      enviar(res, 400, { mensaje: 'El carrito está vacío.' })
      return
    }
    const itemsNormalizados = []
    for (const item of items) {
      const producto = estado.productos.find(
        (registro) => String(registro.id) === String(item.productoId) && registro.activo !== false
      )
      if (!producto) {
        enviar(res, 409, { mensaje: 'Uno de los productos ya no está disponible.' })
        return
      }
      const cantidad = Number(item.cantidad)
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        enviar(res, 400, { mensaje: 'Cantidad de producto inválida.' })
        return
      }
      if (cantidad > producto.stock) {
        enviar(res, 409, { mensaje: `Stock insuficiente para ${producto.nombre}.` })
        return
      }
      if (itemsNormalizados.some((normalizado) => normalizado.productoId === producto.id)) {
        enviar(res, 409, { mensaje: 'Hay productos duplicados en el carrito.' })
        return
      }
      itemsNormalizados.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        precio: producto.precio,
        cantidad,
      })
    }

    const subtotal = itemsNormalizados.reduce(
      (total, item) => total + item.precioUnitario * item.cantidad, 0
    )
    const costoDespacho = tipoEntrega === 'RETIRO'
      ? 0
      : (subtotal >= 1000000 ? 100000 : 50000)
    const aprobado = resultado === 'APROBAR'
    const id = `PED-${Date.now()}-${estado.consecutivo++}`
    const usuario = usuarioDeToken(req, estado)
    const pedido = {
      pedidoId: id,
      id,
      fecha: new Date().toISOString(),
      usuarioId: usuario?.id ?? null,
      comprador: {
        nombre,
        apellidos,
        rut,
        correo,
        telefono: String(comprador.telefono ?? ''),
        observaciones: String(cuerpo.observaciones ?? ''),
      },
      nombre,
      apellidos,
      rut,
      correo,
      tipoEntrega,
      entrega: tipoEntrega,
      direccion,
      comuna,
      items: itemsNormalizados,
      subtotal,
      costoDespacho,
      despacho: costoDespacho,
      total: subtotal + costoDespacho,
      estado: aprobado ? 'CONFIRMADO' : 'RECHAZADO',
      resultadoPagoPrueba: resultado,
      claveOperacion,
    }
    estado.pedidos.push(pedido)
    if (aprobado) {
      itemsNormalizados.forEach((item) => {
        const producto = buscarPorId(estado.productos, item.productoId)
        if (producto) producto.stock -= item.cantidad
      })
    }
    enviar(res, 201, pedido)
    return
  }

  if (ruta === '/ventas/pedidos' && metodo === 'GET') {
    if (!requerirAdmin(req, res, estado)) return
    enviar(res, 200, estado.pedidos)
    return
  }

  if (ruta === '/ventas/mis-pedidos' && metodo === 'GET') {
    const usuario = requerirUsuario(req, res, estado)
    if (!usuario) return
    enviar(res, 200, estado.pedidos.filter(
      (pedido) => pedido.usuarioId === usuario.id
    ))
    return
  }
}

export function crearPluginMocks(claves = {}) {
  const estado = crearEstado(claves)
  return {
    name: 'inmaqui-mocks-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = new URL(req.url ?? '/', 'http://localhost')
          if (!url.pathname.startsWith(`${PREFIJO}/`)) {
            next()
            return
          }
          const ruta = url.pathname.slice(PREFIJO.length)
          await atender(req, res, estado, { pathname: ruta, searchParams: url.searchParams })
          if (!res.writableEnded) next()
        } catch (error) {
          if (!res.writableEnded) {
            enviar(res, 500, { mensaje: 'Error interno del mock de desarrollo.', detalle: String(error?.message ?? error) })
          }
        }
      })
    },
  }
}
