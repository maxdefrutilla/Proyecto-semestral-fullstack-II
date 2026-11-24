package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarEstadoRequest {
    @NotNull(message = "El estado activo es obligatorio")
    private Boolean activo;
}
