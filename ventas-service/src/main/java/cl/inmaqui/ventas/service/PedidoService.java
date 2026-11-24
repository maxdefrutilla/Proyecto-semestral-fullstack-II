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
import java.util.Optional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CatalogoClient catalogoClient;
    private final DespachoService despachoService;

    public PedidoService(PedidoRepository pedidoRepository,
                         CatalogoClient catalogoClient,
                         DespachoService despachoService) {
        this.pedidoRepository = pedidoRepository;
        this.catalogoClient = catalogoClient;
        this.despachoService = despachoService;
    }

    @Transactional
    public PedidoResponse crearPedido(CrearPedidoRequest req, Long usuarioIdAutenticado) {
        // 1. Idempotencia: si la claveOperacion ya existe, retornar el pedido anterior sin duplicar cobro ni stock
        Optional<Pedido> existente = pedidoRepository.findByClaveOperacion(req.getClaveOperacion());
        if (existente.isPresent()) {
            return PedidoResponse.fromEntity(existente.get());
        }

        // 2. Validar RUT
        if (!RutValidator.esValido(req.getRut())) {
            throw new BadRequestException("RUT no válido según algoritmo Módulo 11");
        }

        // 3. Validar despacho
        despachoService.validarDespacho(req.getTipoEntrega(), req.getDireccion(), req.getComuna());

        // 4. Obtener productos de catálogo y calcular subtotal inmutable
        long subtotalCalculado = 0;
        List<PedidoItem> itemsEntidad = new ArrayList<>();
        List<ConfirmarStockClientDto.ItemStock> itemsParaStock = new ArrayList<>();

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
        pedido.setClaveOperacion(req.getClaveOperacion());

        for (ItemPedidoRequest itemReq : req.getItems()) {
            CatalogoProductoDto p = catalogoClient.obtenerProducto(itemReq.getProductoId());
            if (!Boolean.TRUE.equals(p.getActivo())) {
                throw new BadRequestException("El producto " + p.getNombre() + " no está activo para venta");
            }

            long itemSubtotal = (long) itemReq.getCantidad() * p.getPrecio();
            subtotalCalculado += itemSubtotal;

            PedidoItem item = new PedidoItem();
            item.setPedido(pedido);
            item.setProductoId(p.getId());
            item.setNombreProducto(p.getNombre());
            item.setPrecioUnitario(p.getPrecio());
            item.setCantidad(itemReq.getCantidad());
            item.setSubtotal(itemSubtotal);
            itemsEntidad.add(item);

            itemsParaStock.add(new ConfirmarStockClientDto.ItemStock(p.getId(), itemReq.getCantidad(), p.getPrecio()));
        }

        long costoDespacho = despachoService.calcularCosto(req.getTipoEntrega(), subtotalCalculado);
        long totalCalculado = subtotalCalculado + costoDespacho;

        pedido.setSubtotal(subtotalCalculado);
        pedido.setCostoDespacho(costoDespacho);
        pedido.setTotal(totalCalculado);
        pedido.setItems(itemsEntidad);

        // 5. Simulación de pago
        boolean pagoRechazado = "RECHAZADO".equalsIgnoreCase(req.getResultadoPagoPrueba());
        if (pagoRechazado) {
            pedido.setEstado(EstadoPedido.RECHAZADO);
            pedido.setMotivoRechazo("Pago simulado rechazado por la pasarela de prueba");
            return PedidoResponse.fromEntity(pedidoRepository.save(pedido));
        }

        // 6. Si el pago es exitoso, confirmar stock en catálogo
        pedido.setEstado(EstadoPedido.CONFIRMADO);
        Pedido guardado = pedidoRepository.save(pedido);

        try {
            catalogoClient.confirmarStock(new ConfirmarStockClientDto(guardado.getId(), itemsParaStock));
        } catch (Exception e) {
            guardado.setEstado(EstadoPedido.RECHAZADO);
            guardado.setMotivoRechazo("Fallo en la reserva de inventario: " + e.getMessage());
            pedidoRepository.save(guardado);
            throw e;
        }

        return PedidoResponse.fromEntity(guardado);
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
            throw new BadRequestException("No tienes permiso para consultar este pedido");
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