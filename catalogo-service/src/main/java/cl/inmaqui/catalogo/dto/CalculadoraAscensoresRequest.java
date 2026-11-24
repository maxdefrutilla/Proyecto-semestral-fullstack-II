package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CalculadoraAscensoresRequest {
    @NotNull(message = "La altura requerida es obligatoria")
    @Positive(message = "La altura debe ser mayor a 0")
    private Double alturaMetros;

    @NotNull(message = "La capacidad requerida es obligatoria")
    @Positive(message = "La capacidad debe ser mayor a 0")
    private Integer capacidadKg;
}
