package cl.inmaqui.usuarios.dto;

import cl.inmaqui.usuarios.entity.Rol;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarRolRequest {

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

}
