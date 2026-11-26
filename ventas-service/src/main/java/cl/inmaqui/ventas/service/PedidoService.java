package cl.inmaqui.ventas.service;

import cl.inmaqui.ventas.client.CatalogoClient;
import cl.inmaqui.ventas.dto.*;
import cl.inmaqui.ventas.entity.EstadoPedido;
import cl.inmaqui.ventas.entity.Pedido;
import cl.inmaqui.ventas.entity.PedidoItem;
import cl.inmaqui.ventas.exception.BadRequestException;
import cl.inmaqui.ventas.exception.ResourceNotFoundException;
import cl.inmaqui.ventas.repository.PedidoRepository;
import cl.inmaqui.ventas.util.RutValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PedidoService {

    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);
    private final TransactionTemplate transaccion;

    private final PedidoRepository pedidoRepository;
    private final CatalogoClient catalogoClient;
    private final DespachoService despachoService;

    public PedidoService(PedidoRepository pedidoRepository,
                         CatalogoClient catalogoClient,
                         DespachoService despachoService,
                         PlatformTransactionManager transactionManager) {
        this.transaccion = new TransactionTemplate(transactionManager);
        this.pedidoRepository = pedidoRepository;
        this.catalogoClient = catalogoClient;
        this.despachoService = despachoService;
    }

    public PedidoResponse crearPedido(CrearPedidoRequest req, Long usuarioIdAutenticado) {
        String clave = req.getClaveOperacion().toLowerCase(Locale.ROOT);
        if (pedidoRepository.findByClaveOperacion(clave).isEmpty()) {
            try {
                transaccion.executeWithoutResult(status -> guardarPedidoInicial(req, usuarioIdAutenticado, clave));
            } catch (DataIntegrityViolationException e) {
                if (pedidoRepository.findByClaveOperacion(clave).isEmpty()) throw e;
            }
        }

        return transaccion.execute(status -> {
            Pedido pedido = pedidoRepository.bloquearPorClave(clave).orElseThrow();
            if (!Objects.equals(pedido.getUsuarioId(), usuarioIdAutenticado)
                    || !pedido.getRut().equals(RutValidator.normalizar(req.getRut()))
                    || !pedido.getCorreo().equalsIgnoreCase(req.getCorreo().trim())) {
                throw new AccessDeniedException("No tienes permiso para consultar este pedido");
            }
            if (pedido.getEstado() != EstadoPedido.PENDIENTE) return PedidoResponse.fromEntity(pedido);

            List<ConfirmarStockClientDto.ItemStock> items = pedido.getItems().stream()
                    .map(item -> new ConfirmarStockClientDto.ItemStock(
                            item.getProductoId(), item.getCantidad(), item.getPrecioUnitario()))
                    .toList();
            try {
                catalogoClient.confirmarStock(new ConfirmarStockClientDto(pedido.getId(), items));
                pedido.setEstado(EstadoPedido.CONFIRMADO);
            } catch (cl.inmaqui.ventas.exception.ConflictException e) {
                pedido.setEstado(EstadoPedido.RECHAZADO);
                pedido.setMotivoRechazo(e.getMessage());
            } catch (org.springframework.web.client.RestClientException e) {
                log.warn("Confirmación de stock pendiente para pedido {}", pedido.getId(), e);
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                        "No se pudo comprobar el inventario. Reintenta desde este formulario.");
            }
            return PedidoResponse.fromEntity(pedido);
        });
    }

    private void guardarPedidoInicial(CrearPedidoRequest req, Long usuarioIdAutenticado, String clave) {

        // 2. Validar RUT
        if (!RutValidator.esValido(req.getRut())) {
            throw new BadRequestException("RUT no válido según algoritmo Módulo 11");
        }

        // 3. Validar despacho
        despachoService.validarDespacho(req.getTipoEntrega(), req.getDireccion(), req.getComuna());

        // 4. Obtener productos de catálogo y calcular subtotal inmutable
        long subtotalCalculado = 0;
        List<PedidoItem> itemsEntidad = new ArrayList<>();
        Set<Long> productos = new HashSet<>();

        Pedido pedido = new Pedido();
        pedido.setUsuarioId(usuarioIdAutenticado);
        pedido.setNombre(req.getNombre().trim());
        pedido.setApellidos(req.getApellidos().trim());
        pedido.setRut(RutValidator.normalizar(req.getRut()));
        pedido.setCorreo(req.getCorreo().trim().toLowerCase());
        pedido.setTelefono(req.getTelefono());
        pedido.setTipoEntrega(req.getTipoEntrega());
        pedido.setDireccion(req.getDireccion());
        pedido.setComuna(req.getComuna());
        pedido.setObservaciones(req.getObservaciones());
        pedido.setClaveOperacion(clave);

        for (ItemPedidoRequest itemReq : req.getItems()) {
            if (!productos.add(itemReq.getProductoId())) {
                throw new BadRequestException("Cada producto debe aparecer una sola vez");
            }
            CatalogoProductoDto p = catalogoClient.obtenerProducto(itemReq.getProductoId());
            if (!Boolean.TRUE.equals(p.getActivo())) {
                throw new BadRequestException("El producto " + p.getNombre() + " no está activo para venta");
            }

            long itemSubtotal;
            try {
                itemSubtotal = Math.multiplyExact((long) itemReq.getCantidad(), p.getPrecio());
                subtotalCalculado = Math.addExact(subtotalCalculado, itemSubtotal);
            } catch (ArithmeticException e) {
                throw new BadRequestException("El pedido supera el importe máximo");
            }

            PedidoItem item = new PedidoItem();
            item.setPedido(pedido);
            item.setProductoId(p.getId());
            item.setNombreProducto(p.getNombre());
            item.setPrecioUnitario(p.getPrecio());
            item.setCantidad(itemReq.getCantidad());
            item.setSubtotal(itemSubtotal);
            itemsEntidad.add(item);

        }

        long costoDespacho = despachoService.calcularCosto(req.getTipoEntrega(), subtotalCalculado);
        if (subtotalCalculado > Long.MAX_VALUE - costoDespacho) {
            throw new BadRequestException("El pedido supera el importe máximo");
        }
        long totalCalculado = subtotalCalculado + costoDespacho;

        pedido.setSubtotal(subtotalCalculado);
        pedido.setCostoDespacho(costoDespacho);
        pedido.setTotal(totalCalculado);
        pedido.setItems(itemsEntidad);

        if ("RECHAZADO".equals(req.getResultadoPagoPrueba())) {
            pedido.setEstado(EstadoPedido.RECHAZADO);
            pedido.setMotivoRechazo("Pago de prueba rechazado");
        } else {
            pedido.setEstado(EstadoPedido.PENDIENTE);
        }
        pedidoRepository.saveAndFlush(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarMisPedidos(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByCreadoEnDesc(usuarioId).stream()
                .map(PedidoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAllByOrderByCreadoEnDesc().stream()
                .map(PedidoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtenerPorId(Long id, Long usuarioId, boolean esAdmin) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con ID: " + id));

        if (!esAdmin && (pedido.getUsuarioId() == null || !pedido.getUsuarioId().equals(usuarioId))) {
            throw new AccessDeniedException("No tienes permiso para consultar este pedido");
        }

        return PedidoResponse.fromEntity(pedido);
    }

    @Transactional(readOnly = true)
    public ResumenVentasResponse obtenerResumen() {
        long totalPedidos = pedidoRepository.count();
        long confirmados = pedidoRepository.countByEstado(EstadoPedido.CONFIRMADO);
        long rechazados = pedidoRepository.countByEstado(EstadoPedido.RECHAZADO);

        long montoTotal = pedidoRepository.findAll().stream()
                .filter(p -> p.getEstado() == EstadoPedido.CONFIRMADO)
                .mapToLong(Pedido::getTotal)
                .sum();

        return ResumenVentasResponse.builder()
                .totalPedidos(totalPedidos)
                .pedidosConfirmados(confirmados)
                .pedidosRechazados(rechazados)
                .montoTotalVentas(montoTotal)
                .build();
    }

}