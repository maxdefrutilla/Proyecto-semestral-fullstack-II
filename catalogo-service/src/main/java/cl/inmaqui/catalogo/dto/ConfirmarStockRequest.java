package cl.inmaqui.catalogo.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ConfirmarStockRequest {
    @NotNull(message = "El pedidoId es obligatorio")
    private Long pedidoId;

    @NotEmpty(message = "Debe incluir al menos un producto a reservar")
    @Valid
    private List<ReservaStockItemDto> items;
}
