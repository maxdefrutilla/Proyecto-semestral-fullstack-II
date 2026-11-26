package cl.inmaqui.usuarios.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ActualizarUsuarioRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 80)
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100)
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio")
    @Email
    @Size(max = 120)
    private String correo;

    @Size(max = 255)
    private String direccion;
    @Size(max = 100)
    private String comuna;
    @Size(max = 20)
    private String telefono;
    private String password;

}
