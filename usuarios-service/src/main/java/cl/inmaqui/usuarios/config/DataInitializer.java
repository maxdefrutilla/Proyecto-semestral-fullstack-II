package cl.inmaqui.usuarios.config;

import cl.inmaqui.usuarios.entity.Rol;
import cl.inmaqui.usuarios.entity.Usuario;
import cl.inmaqui.usuarios.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.init-username}")
    private String adminUsername;

    @Value("${app.admin.init-password}")
    private String adminPassword;

    @Value("${app.admin.init-correo}")
    private String adminCorreo;

    @Value("${app.admin.init-rut}")
    private String adminRut;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.countByRolAndActivoTrue(Rol.ADMINISTRADOR) == 0) {
            if (adminUsername.isBlank() || adminUsername.length() > 30
                    || adminPassword.length() < 12 || adminPassword.length() > 64
                    || adminPassword.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72
                    || !adminCorreo.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+") || adminCorreo.length() > 120
                    || !cl.inmaqui.usuarios.util.RutValidator.esValido(adminRut)) {
                throw new IllegalStateException("Configura ADMIN_INIT_USERNAME, ADMIN_INIT_PASSWORD, ADMIN_INIT_CORREO y ADMIN_INIT_RUT");
            }
            if (usuarioRepository.existsByUsuario(adminUsername)) {
                throw new IllegalStateException("El usuario elegido para el administrador inicial ya está registrado");
            }
            Usuario admin = new Usuario();
            admin.setUsuario(adminUsername);
            admin.setNombre("Administrador");
            admin.setApellidos("INMAQUI");
            admin.setRut(cl.inmaqui.usuarios.util.RutValidator.normalizar(adminRut));
            admin.setCorreo(adminCorreo);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRol(Rol.ADMINISTRADOR);
            admin.setActivo(true);

            usuarioRepository.save(admin);
            log.info("Administrador inicial creado exitosamente: {}", adminUsername);
        } else {
            log.info("Administrador inicial ya existe: {}", adminUsername);
        }
    }
    
}