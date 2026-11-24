package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CalculadoraAndamiosRequest {
    @NotNull(message = "El ID del producto andamio es obligatorio")
    private Long productoId;

    @NotNull(message = "El largo en metros es obligatorio")
    @Positive(message = "El largo debe ser mayor a 0")
    private Double largoMetros;

    @NotNull(message = "El alto en metros es obligatorio")
    @Positive(message = "El alto debe ser mayor a 0")
    private Double altoMetros;
}
