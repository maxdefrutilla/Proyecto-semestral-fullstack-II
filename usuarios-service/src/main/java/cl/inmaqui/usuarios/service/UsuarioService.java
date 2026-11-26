package cl.inmaqui.usuarios.service;

import cl.inmaqui.usuarios.dto.*;
import cl.inmaqui.usuarios.entity.*;
import cl.inmaqui.usuarios.exception.*;
import cl.inmaqui.usuarios.repository.UsuarioRepository;
import cl.inmaqui.usuarios.util.RutValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UsuarioResponse registrar(RegistroRequest request) {
        if (!RutValidator.esValido(request.getRut())) {
            throw new BadRequestException("El RUT ingresado no es válido según algoritmo Módulo 11");
        }
        String rutNormalizado = RutValidator.normalizar(request.getRut());

        if (usuarioRepository.existsByUsuario(request.getUsuario().trim())) {
            throw new ConflictException("El nombre de usuario ya está registrado");
        }
        if (usuarioRepository.existsByCorreo(request.getCorreo().trim().toLowerCase(java.util.Locale.ROOT))) {
            throw new ConflictException("El correo electrónico ya está registrado");
        }
        if (usuarioRepository.existsByRut(rutNormalizado)) {
            throw new ConflictException("El RUT ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setUsuario(request.getUsuario().trim());
        usuario.setNombre(request.getNombre().trim());
        usuario.setApellidos(request.getApellidos().trim());
        usuario.setRut(rutNormalizado);
        usuario.setCorreo(request.getCorreo().trim().toLowerCase());
        usuario.setPasswordHash(passwordEncoder.encode(validarPassword(request.getPassword())));
        usuario.setRol(Rol.CLIENTE);
        usuario.setDireccion(request.getDireccion());
        usuario.setComuna(request.getComuna());
        usuario.setTelefono(request.getTelefono());
        usuario.setActivo(true);

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    private String validarPassword(String password) {
        if (password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
            throw new BadRequestException("La contraseña supera 72 bytes en UTF-8");
        }
        return password;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String identificador = request.getUsuario().trim();
        Usuario usuario = usuarioRepository.findByUsuario(identificador)
                .or(() -> usuarioRepository.findByCorreo(identificador.toLowerCase()))
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas"));

        if (!usuario.getActivo()) {
            throw new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
        }

        if (request.getPassword().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72
                || !passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario);
        return new LoginResponse(token, "Bearer", UsuarioResponse.fromEntity(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return UsuarioResponse.fromEntity(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(Long usuarioId, ActualizarUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!usuario.getCorreo().equalsIgnoreCase(request.getCorreo())) {
            if (usuarioRepository.existsByCorreo(request.getCorreo().trim().toLowerCase(java.util.Locale.ROOT))) {
                throw new ConflictException("El correo ya se encuentra en uso");
            }
            usuario.setCorreo(request.getCorreo().trim().toLowerCase());
        }

        usuario.setNombre(request.getNombre().trim());
        usuario.setApellidos(request.getApellidos().trim());
        usuario.setDireccion(request.getDireccion());
        usuario.setComuna(request.getComuna());
        usuario.setTelefono(request.getTelefono());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 8 || request.getPassword().length() > 64) {
                throw new BadRequestException("La nueva contraseña debe tener entre 8 y 64 caracteres");
            }
            usuario.setPasswordHash(passwordEncoder.encode(validarPassword(request.getPassword())));
        }

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse cambiarEstado(Long id, Boolean nuevoEstado, Long adminEjecutorId) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        // Regla: No desactivarse a sí mismo
        if (id.equals(adminEjecutorId) && Boolean.FALSE.equals(nuevoEstado)) {
            throw new BadRequestException("No puedes desactivar tu propia cuenta administradora");
        }

        // Regla: No desactivar al último administrador
        if (usuario.getRol() == Rol.ADMINISTRADOR && Boolean.FALSE.equals(nuevoEstado)) {
            long adminsActivos = usuarioRepository.countByRolAndActivoTrue(Rol.ADMINISTRADOR);
            if (adminsActivos <= 1) {
                throw new BadRequestException("No es posible desactivar al último administrador del sistema");
            }
        }

        usuario.setActivo(nuevoEstado);
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse cambiarRol(Long id, Rol nuevoRol, Long adminEjecutorId) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        // Regla: No degradar al último administrador
        if (usuario.getRol() == Rol.ADMINISTRADOR && nuevoRol != Rol.ADMINISTRADOR) {
            long adminsActivos = usuarioRepository.countByRolAndActivoTrue(Rol.ADMINISTRADOR);
            if (adminsActivos <= 1) {
                throw new BadRequestException("No es posible quitar el rol al último administrador del sistema");
            }
        }

        usuario.setRol(nuevoRol);
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminarLogico(Long id, Long adminEjecutorId) {
        cambiarEstado(id, false, adminEjecutorId);
    }
}