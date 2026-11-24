package cl.inmaqui.catalogo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CalculadoraAndamiosResponse {
    private Long productoId;
    private Integer filas;
    private Integer columnas;
    private Integer cantidad;
    private Long precioUnitario;
    private Long subtotal;
    private String aviso;
}
