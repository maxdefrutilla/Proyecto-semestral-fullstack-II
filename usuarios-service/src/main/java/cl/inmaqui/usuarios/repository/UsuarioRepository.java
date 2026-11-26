package cl.inmaqui.usuarios.repository;

import cl.inmaqui.usuarios.entity.Rol;
import cl.inmaqui.usuarios.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByUsuario(String usuario);
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByRut(String rut);

    boolean existsByUsuario(String usuario);
    boolean existsByCorreo(String correo);
    boolean existsByRut(String rut);

    long countByRolAndActivoTrue(Rol rol);

}