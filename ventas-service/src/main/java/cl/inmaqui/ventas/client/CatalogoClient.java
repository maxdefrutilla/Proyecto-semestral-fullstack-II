package cl.inmaqui.ventas.client;

import cl.inmaqui.ventas.dto.CatalogoProductoDto;
import cl.inmaqui.ventas.dto.ConfirmarStockClientDto;
import cl.inmaqui.ventas.exception.ConflictException;
import cl.inmaqui.ventas.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class CatalogoClient {

    private final RestClient restClient;
    private final String internalToken;

    public CatalogoClient(RestClient catalogoRestClient,
                          @Value("${app.internal-token}") String internalToken) {
        this.restClient = catalogoRestClient;
        if (internalToken.length() < 32) {
            throw new IllegalArgumentException("INTERNAL_SERVICE_TOKEN debe tener al menos 32 caracteres");
        }
        this.internalToken = internalToken;
    }

    public CatalogoProductoDto obtenerProducto(Long productoId) {
        return restClient.get()
                .uri("/api/v1/catalogo/productos/{id}", productoId)
                .retrieve()
                .onStatus(status -> status.value() == 404, (req, res) -> {
                    throw new ResourceNotFoundException("Producto no encontrado en catálogo con ID: " + productoId);
                })
                .body(CatalogoProductoDto.class);
    }

    public void confirmarStock(ConfirmarStockClientDto dto) {
        StockResultado resultado = restClient.post()
                .uri("/api/v1/interno/stock/confirmar")
                .header("X-Internal-Token", internalToken)
                .body(dto)
                .retrieve()
                .onStatus(status -> status.value() == 409, (req, res) -> {
                    throw new ConflictException("Inventario o precio no disponible para confirmar el pedido");
                })
                .body(StockResultado.class);
        if (resultado == null || !dto.getPedidoId().equals(resultado.pedidoId())) {
            throw new org.springframework.web.client.RestClientException("Respuesta de inventario inválida");
        }
        if (!"CONFIRMADA".equals(resultado.estado())) {
            throw new ConflictException("La reserva de inventario no está confirmada");
        }
    }

    public void revertirStock(Long pedidoId) {
        restClient.post()
                    .uri("/api/v1/interno/stock/revertir")
                    .header("X-Internal-Token", internalToken)
                    .body(Map.of("pedidoId", pedidoId))
                    .retrieve()
                    .toBodilessEntity();

    }

    private record StockResultado(Long pedidoId, String estado) {}
}