package cl.inmaqui.catalogo.controller;

import cl.inmaqui.catalogo.dto.ActualizarCategoriaRequest;
import cl.inmaqui.catalogo.dto.CambiarEstadoRequest;
import cl.inmaqui.catalogo.dto.CategoriaResponse;
import cl.inmaqui.catalogo.dto.CrearCategoriaRequest;
import cl.inmaqui.catalogo.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogo/categorias")
@Tag(name = "Categorías", description = "Gestión del catálogo de categorías")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    @Operation(summary = "Listar categorías (Público; admin puede pasar incluirInactivos=true)")
    public ResponseEntity<List<CategoriaResponse>> listar(
            @RequestParam(required = false, defaultValue = "false") boolean incluirInactivos,
            Authentication authentication) {
        boolean esAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        return ResponseEntity.ok(categoriaService.listar(incluirInactivos && esAdmin));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID (Público)")
    public ResponseEntity<CategoriaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear nueva categoría (Solo ADMINISTRADOR)")
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CrearCategoriaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría (Solo ADMINISTRADOR)")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable Long id,
                                                        @Valid @RequestBody ActualizarCategoriaRequest req) {
        return ResponseEntity.ok(categoriaService.actualizar(id, req));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado activo/inactivo (Solo ADMINISTRADOR)")
    public ResponseEntity<CategoriaResponse> cambiarEstado(@PathVariable Long id,
                                                           @Valid @RequestBody CambiarEstadoRequest req) {
        return ResponseEntity.ok(categoriaService.cambiarEstado(id, req.getActivo()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Baja lógica de categoría (Solo ADMINISTRADOR)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminarLogico(id);
        return ResponseEntity.noContent().build();
    }
}
