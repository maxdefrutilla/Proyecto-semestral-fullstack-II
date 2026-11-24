package cl.inmaqui.ventas.controller;

import cl.inmaqui.ventas.dto.CrearPedidoRequest;
import cl.inmaqui.ventas.dto.PedidoResponse;
import cl.inmaqui.ventas.dto.ResumenVentasResponse;
import cl.inmaqui.ventas.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ventas")
@Tag(name = "Ventas y Checkout", description = "Gestión de pedidos, checkout público y resumen comercial")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/pedidos")
    @Operation(summary = "Crear nuevo pedido (Público; invitado sin token o cliente con Bearer)")
    public ResponseEntity<PedidoResponse> crearPedido(@Valid @RequestBody CrearPedidoRequest request,
                                                      Authentication authentication) {
        Long usuarioId = null;
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            usuarioId = Long.parseLong(jwt.getSubject());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearPedido(request, usuarioId));
    }

    @GetMapping("/mis-pedidos")
    @Operation(summary = "Listar pedidos del usuario autenticado")
    public ResponseEntity<List<PedidoResponse>> misPedidos(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long usuarioId = Long.parseLong(jwt.getSubject());
        return ResponseEntity.ok(pedidoService.listarMisPedidos(usuarioId));
    }

    @GetMapping("/pedidos")
    @Operation(summary = "Listar todos los pedidos (Solo ADMINISTRADOR)")
    public ResponseEntity<List<PedidoResponse>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/pedidos/{id}")
    @Operation(summary = "Obtener pedido por ID (Propietario o ADMINISTRADOR)")
    public ResponseEntity<PedidoResponse> obtenerPorId(@PathVariable Long id, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long usuarioId = Long.parseLong(jwt.getSubject());
        boolean esAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));

        return ResponseEntity.ok(pedidoService.obtenerPorId(id, usuarioId, esAdmin));
    }

    @GetMapping("/resumen")
    @Operation(summary = "Resumen de ventas y métricas (Solo ADMINISTRADOR)")
    public ResponseEntity<ResumenVentasResponse> obtenerResumen() {
        return ResponseEntity.ok(pedidoService.obtenerResumen());
    }
    
}