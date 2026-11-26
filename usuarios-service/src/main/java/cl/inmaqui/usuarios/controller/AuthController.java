package cl.inmaqui.usuarios.controller;

import cl.inmaqui.usuarios.dto.LoginRequest;
import cl.inmaqui.usuarios.dto.LoginResponse;
import cl.inmaqui.usuarios.dto.RegistroRequest;
import cl.inmaqui.usuarios.dto.UsuarioResponse;
import cl.inmaqui.usuarios.service.SesionService;
import cl.inmaqui.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private static final String COOKIE = "inmaqui_sesion";
    private static final String HEADER = "X-Inmaqui-Session";

    private final UsuarioService usuarioService;
    private final SesionService sesiones;
    private final boolean cookieSegura;

    public AuthController(UsuarioService usuarioService, SesionService sesiones,
                          @Value("${app.jwt.cookie-secure}") boolean cookieSegura) {
        this.usuarioService = usuarioService;
        this.sesiones = sesiones;
        this.cookieSegura = cookieSegura;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
            @RequestHeader(value = HEADER, required = false) String solicitud,
            @CookieValue(value = COOKIE, required = false) String anterior) {
        LoginResponse login = usuarioService.login(request);
        if (!"1".equals(solicitud)) return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(login);
        return conSesion(login, sesiones.iniciar(login.getUsuario().getId(), anterior));
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registrar(@Valid @RequestBody RegistroRequest request) {
        return usuarioService.registrar(request);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> renovar(
            @RequestHeader(value = HEADER, required = false) String solicitud,
            @CookieValue(value = COOKIE, required = false) String anterior) {
        validarSolicitud(solicitud);
        var sesion = sesiones.renovar(anterior);
        return conSesion(sesion.login(), sesion.token());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> cerrar(
            @RequestHeader(value = HEADER, required = false) String solicitud,
            @CookieValue(value = COOKIE, required = false) String token) {
        validarSolicitud(solicitud);
        sesiones.revocar(token);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie("", Duration.ZERO).toString()).build();
    }

    private void validarSolicitud(String solicitud) {
        if (!"1".equals(solicitud)) throw new AccessDeniedException("Falta la cabecera de sesión");
    }

    private ResponseEntity<LoginResponse> conSesion(LoginResponse login, String token) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .header(HttpHeaders.SET_COOKIE, cookie(token, Duration.ofDays(7)).toString())
                .body(login);
    }

    private ResponseCookie cookie(String token, Duration duracion) {
        return ResponseCookie.from(COOKIE, token).path("/api/v1/auth").httpOnly(true)
                .secure(cookieSegura).sameSite("Strict").maxAge(duracion).build();
    }
}
