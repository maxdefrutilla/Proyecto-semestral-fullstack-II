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
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.transaction.annotation.Isolation;

@Service
public class StockInternoService {

    private final ProductoRepository productoRepository;
    private final ReservaStockRepository reservaStockRepository;

    public StockInternoService(ProductoRepository productoRepository,
                               ReservaStockRepository reservaStockRepository) {
        this.productoRepository = productoRepository;
        this.reservaStockRepository = reservaStockRepository;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public StockResponse confirmarStock(ConfirmarStockRequest req) {
        // Idempotencia: si ya existe la reserva para este pedidoId
        Optional<ReservaStock> existente = reservaStockRepository.findByPedidoId(req.getPedidoId());
        if (existente.isPresent()) {
            ReservaStock r = existente.get();
            return new StockResponse(r.getPedidoId(), r.getEstado(), "Operación de stock ya procesada previamente (Idempotente)");
        }

        ReservaStock reserva = new ReservaStock();
        reserva.setPedidoId(req.getPedidoId());
        reserva.setEstado("CONFIRMADA");

        reservaStockRepository.saveAndFlush(reserva);
        List<ReservaStockItemDto> items = req.getItems().stream()
                .sorted(Comparator.comparing(ReservaStockItemDto::getProductoId)).toList();
        Set<Long> productos = new HashSet<>();
        for (ReservaStockItemDto item : items) {
            if (!productos.add(item.getProductoId())) {
                throw new ConflictException("La reserva contiene productos repetidos");
            }
            Producto p = productoRepository.bloquearPorId(item.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
            if (!p.getActivo() || !p.getCategoria().getActivo() || p.getStock() < item.getCantidad()
                    || !p.getPrecio().equals(item.getPrecioUnitario())) {
                throw new ConflictException("Inventario o precio no disponible para " + p.getNombre());
            }
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

    @Transactional(isolation = Isolation.READ_COMMITTED)
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
        List<ReservaItem> items = reserva.getItems().stream()
                .sorted(Comparator.comparing(item -> item.getProducto().getId())).toList();
        for (ReservaItem item : items) {
            Producto p = productoRepository.bloquearPorId(item.getProducto().getId()).orElseThrow();
            p.setStock(Math.addExact(p.getStock(), item.getCantidad()));
            productoRepository.save(p);
        }

        reserva.setEstado("REVERTIDA");
        reservaStockRepository.save(reserva);
        return new StockResponse(pedidoId, "REVERTIDA", "Stock repuesto exitosamente");
    }
}
