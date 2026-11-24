package cl.inmaqui.catalogo.controller;

import cl.inmaqui.catalogo.dto.*;
import cl.inmaqui.catalogo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogo")
@Tag(name = "Productos y Calculadoras", description = "Catálogo de productos y calculadoras comerciales")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/productos")
    @Operation(summary = "Listar y buscar productos (Público; admin puede pasar incluirInactivos=true)")
    public ResponseEntity<List<ProductoResponse>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false, defaultValue = "false") boolean incluirInactivos,
            Authentication authentication) {
        boolean esAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        return ResponseEntity.ok(productoService.listar(categoria, busqueda, incluirInactivos && esAdmin));
    }

    @GetMapping("/productos/{id}")
    @Operation(summary = "Obtener producto por ID (Público)")
    public ResponseEntity<ProductoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @PostMapping("/productos")
    @Operation(summary = "Crear nuevo producto (Solo ADMINISTRADOR)")
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody CrearProductoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(req));
    }

    @PutMapping("/productos/{id}")
    @Operation(summary = "Actualizar producto (Solo ADMINISTRADOR)")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody ActualizarProductoRequest req) {
        return ResponseEntity.ok(productoService.actualizar(id, req));
    }

    @PatchMapping("/productos/{id}/estado")
    @Operation(summary = "Cambiar estado activo/inactivo de producto (Solo ADMINISTRADOR)")
    public ResponseEntity<ProductoResponse> cambiarEstado(@PathVariable Long id,
                                                          @Valid @RequestBody CambiarEstadoRequest req) {
        return ResponseEntity.ok(productoService.cambiarEstado(id, req.getActivo()));
    }

    @DeleteMapping("/productos/{id}")
    @Operation(summary = "Baja lógica de producto (Solo ADMINISTRADOR)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminarLogico(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calculadoras/andamios")
    @Operation(summary = "Calculadora comercial de andamios (Público)")
    public ResponseEntity<CalculadoraAndamiosResponse> calcularAndamios(@Valid @RequestBody CalculadoraAndamiosRequest req) {
        return ResponseEntity.ok(productoService.calcularAndamios(req));
    }

    @PostMapping("/calculadoras/ascensores")
    @Operation(summary = "Calculadora de compatibilidad de ascensores (Público)")
    public ResponseEntity<List<ProductoResponse>> calcularAscensores(@Valid @RequestBody CalculadoraAscensoresRequest req) {
        return ResponseEntity.ok(productoService.calcularAscensores(req));
    }
}
