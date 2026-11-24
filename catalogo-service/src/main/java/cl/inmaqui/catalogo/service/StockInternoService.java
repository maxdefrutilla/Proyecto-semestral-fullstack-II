package cl.inmaqui.catalogo.service;

import cl.inmaqui.catalogo.dto.ConfirmarStockRequest;
import cl.inmaqui.catalogo.dto.ReservaStockItemDto;
import cl.inmaqui.catalogo.dto.StockResponse;
import cl.inmaqui.catalogo.entity.Producto;
import cl.inmaqui.catalogo.entity.ReservaItem;
import cl.inmaqui.catalogo.entity.ReservaStock;
import cl.inmaqui.catalogo.exception.ConflictException;
import cl.inmaqui.catalogo.exception.ResourceNotFoundException;
import cl.inmaqui.catalogo.repository.ProductoRepository;
import cl.inmaqui.catalogo.repository.ReservaStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class StockInternoService {

    private final ProductoRepository productoRepository;
    private final ReservaStockRepository reservaStockRepository;

    public StockInternoService(ProductoRepository productoRepository,
                               ReservaStockRepository reservaStockRepository) {
        this.productoRepository = productoRepository;
        this.reservaStockRepository = reservaStockRepository;
    }

    @Transactional
    public StockResponse confirmarStock(ConfirmarStockRequest req) {
        // Idempotencia: si ya existe la reserva para este pedidoId
        Optional<ReservaStock> existente = reservaStockRepository.findByPedidoId(req.getPedidoId());
        if (existente.isPresent()) {
            ReservaStock r = existente.get();
            return new StockResponse(r.getPedidoId(), r.getEstado(), "Operación de stock ya procesada previamente (Idempotente)");
        }

        // 1. Validar disponibilidad de stock de todos los items
        for (ReservaStockItemDto item : req.getItems()) {
            Producto p = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + item.getProductoId()));

            if (p.getStock() < item.getCantidad()) {
                throw new ConflictException("Stock insuficiente para el producto: " + p.getNombre() +
                        ". Disponible: " + p.getStock() + ", Solicitado: " + item.getCantidad());
            }
        }

        // 2. Descontar stock y registrar reserva
        ReservaStock reserva = new ReservaStock();
        reserva.setPedidoId(req.getPedidoId());
        reserva.setEstado("CONFIRMADA");

        for (ReservaStockItemDto item : req.getItems()) {
            Producto p = productoRepository.findById(item.getProductoId()).orElseThrow();
            p.setStock(p.getStock() - item.getCantidad());
            productoRepository.save(p);

            ReservaItem ri = new ReservaItem();
            ri.setReserva(reserva);
            ri.setProducto(p);
            ri.setCantidad(item.getCantidad());
            ri.setPrecioUnitario(item.getPrecioUnitario());
            reserva.getItems().add(ri);
        }

        reservaStockRepository.save(reserva);
        return new StockResponse(req.getPedidoId(), "CONFIRMADA", "Stock descontado exitosamente");
    }

    @Transactional
    public StockResponse revertirStock(Long pedidoId) {
        Optional<ReservaStock> existente = reservaStockRepository.findByPedidoId(pedidoId);
        if (existente.isEmpty()) {
            return new StockResponse(pedidoId, "NO_EXISTE", "No existe reserva de stock para revertir");
        }

        ReservaStock reserva = existente.get();
        if ("REVERTIDA".equalsIgnoreCase(reserva.getEstado())) {
            return new StockResponse(pedidoId, "REVERTIDA", "La reserva ya fue revertida previamente");
        }

        // Reponer stock
        for (ReservaItem item : reserva.getItems()) {
            Producto p = item.getProducto();
            p.setStock(p.getStock() + item.getCantidad());
            productoRepository.save(p);
        }

        reserva.setEstado("REVERTIDA");
        reservaStockRepository.save(reserva);
        return new StockResponse(pedidoId, "REVERTIDA", "Stock repuesto exitosamente");
    }
}
