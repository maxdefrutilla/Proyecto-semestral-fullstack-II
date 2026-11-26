package cl.inmaqui.usuarios.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegistroRequest {

    @NotBlank(message = "El usuario es obligatorio")
    @Size(min = 3, max = 30, message = "El usuario debe tener entre 3 y 30 caracteres")
    private String usuario;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 80, message = "El nombre no puede exceder 80 caracteres")
    private String nombre;
    
    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no pueden exceder 100 caracteres")
    private String apellidos;
    
    @NotBlank(message = "El RUT es obligatorio")
    @Size(max = 12, message = "El RUT no puede exceder 12 caracteres")
    private String rut;
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato de correo no es válido")
    @Size(max = 120, message = "El correo no puede exceder 120 caracteres")
    private String correo;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres")
    private String password;
    
    @Size(max = 255)
    private String direccion;
    
    @Size(max = 100)
    private String comuna;
    
    @Size(max = 20)
    private String telefono;

}
