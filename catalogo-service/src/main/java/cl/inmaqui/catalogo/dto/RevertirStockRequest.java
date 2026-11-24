package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RevertirStockRequest {
    @NotNull(message = "El pedidoId es obligatorio")
    private Long pedidoId;
}
