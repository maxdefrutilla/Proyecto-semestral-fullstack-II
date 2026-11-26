package cl.inmaqui.catalogo.controller;

import cl.inmaqui.catalogo.dto.ConfirmarStockRequest;
import cl.inmaqui.catalogo.dto.RevertirStockRequest;
import cl.inmaqui.catalogo.dto.StockResponse;
import cl.inmaqui.catalogo.service.StockInternoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/interno/stock")
@Tag(name = "Stock Interno", description = "Endpoints de comunicación interna entre servicios para reserva y reversión de inventario")
public class StockInternoController {

    private final StockInternoService stockInternoService;
    private final String internalToken;

    public StockInternoController(StockInternoService stockInternoService,
                                  @Value("${app.internal-token}") String internalToken) {
        this.stockInternoService = stockInternoService;
        if (internalToken.length() < 32) {
            throw new IllegalArgumentException("INTERNAL_SERVICE_TOKEN debe tener al menos 32 caracteres");
        }
        this.internalToken = internalToken;
    }

    private void validarTokenInterno(String token) {
        if (token == null || !java.security.MessageDigest.isEqual(
                internalToken.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                token.getBytes(java.nio.charset.StandardCharsets.UTF_8))) {
            throw new AccessDeniedException("Acceso interno no autorizado: Token de servicio inválido");
        }
    }

    @PostMapping("/confirmar")
    @Operation(summary = "Confirmar y descontar stock para un pedido (Uso interno)")
    public ResponseEntity<StockResponse> confirmarStock(
            @RequestHeader(value = "X-Internal-Token", required = false) String token,
            @Valid @RequestBody ConfirmarStockRequest req) {
        validarTokenInterno(token);
        return ResponseEntity.ok(stockInternoService.confirmarStock(req));
    }

    @PostMapping("/revertir")
    @Operation(summary = "Revertir y reponer stock de un pedido cancelado/fallido (Uso interno)")
    public ResponseEntity<StockResponse> revertirStock(
            @RequestHeader(value = "X-Internal-Token", required = false) String token,
            @Valid @RequestBody RevertirStockRequest req) {
        validarTokenInterno(token);
        return ResponseEntity.ok(stockInternoService.revertirStock(req.getPedidoId()));
    }
}
