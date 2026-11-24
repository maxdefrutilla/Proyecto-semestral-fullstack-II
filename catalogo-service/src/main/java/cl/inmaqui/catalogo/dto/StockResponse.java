package cl.inmaqui.catalogo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockResponse {
    private Long pedidoId;
    private String estado;
    private String mensaje;
}
