package cl.inmaqui.usuarios.dto;

import cl.inmaqui.usuarios.entity.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UsuarioResponse {

    private Long id;
    private String usuario;
    private String nombre;
    private String apellidos;
    private String rut;
    private String correo;
    private Rol rol;
    private String direccion;
    private String comuna;
    private String telefono;
    private Boolean activo;
    private LocalDateTime creadoEn;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .usuario(usuario.getUsuario())
                .nombre(usuario.getNombre())
                .apellidos(usuario.getApellidos())
                .rut(usuario.getRut())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol())
                .direccion(usuario.getDireccion())
                .comuna(usuario.getComuna())
                .telefono(usuario.getTelefono())
                .activo(usuario.getActivo())
                .creadoEn(usuario.getCreadoEn())
                .build();
    }

}
