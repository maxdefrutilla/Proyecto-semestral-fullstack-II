package cl.inmaqui.usuarios.controller;

import cl.inmaqui.usuarios.dto.*;
import cl.inmaqui.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Gestión de perfil y administración de usuarios")
@SecurityRequirement(name = "BearerAuth")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener el perfil del usuario autenticado")
    public ResponseEntity<UsuarioResponse> obtenerMiPerfil(@AuthenticationPrincipal Jwt jwt) {
        Long usuarioId = Long.parseLong(jwt.getSubject());
        return ResponseEntity.ok(usuarioService.obtenerPorId(usuarioId));
    }

    @PutMapping("/me")
    @Operation(summary = "Actualizar el perfil del usuario autenticado")
    public ResponseEntity<UsuarioResponse> actualizarMiPerfil(@AuthenticationPrincipal Jwt jwt,
                                                              @Valid @RequestBody ActualizarUsuarioRequest request) {
        Long usuarioId = Long.parseLong(jwt.getSubject());
        return ResponseEntity.ok(usuarioService.actualizarPerfil(usuarioId, request));
    }

    @GetMapping
    @Operation(summary = "Listar todos los usuarios (Solo ADMINISTRADOR)")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID (Solo ADMINISTRADOR)")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario por ID (Solo ADMINISTRADOR)")
    public ResponseEntity<UsuarioResponse> actualizarUsuario(@PathVariable Long id,
                                                            @Valid @RequestBody ActualizarUsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(id, request));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado activo/inactivo (Solo ADMINISTRADOR)")
    public ResponseEntity<UsuarioResponse> cambiarEstado(@PathVariable Long id,
                                                         @Valid @RequestBody CambiarEstadoRequest request,
                                                         @AuthenticationPrincipal Jwt jwt) {
        Long adminId = Long.parseLong(jwt.getSubject());
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, request.getActivo(), adminId));
    }

    @PatchMapping("/{id}/rol")
    @Operation(summary = "Cambiar rol de usuario (Solo ADMINISTRADOR)")
    public ResponseEntity<UsuarioResponse> cambiarRol(@PathVariable Long id,
                                                      @Valid @RequestBody CambiarRolRequest request,
                                                      @AuthenticationPrincipal Jwt jwt) {
        Long adminId = Long.parseLong(jwt.getSubject());
        return ResponseEntity.ok(usuarioService.cambiarRol(id, request.getRol(), adminId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Baja lógica de usuario (activo=false) (Solo ADMINISTRADOR)")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id,
                                                @AuthenticationPrincipal Jwt jwt) {
        Long adminId = Long.parseLong(jwt.getSubject());
        usuarioService.eliminarLogico(id, adminId);
        return ResponseEntity.noContent().build();
    }
    
}