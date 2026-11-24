package cl.inmaqui.ventas.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenVentasResponse {

    private Long totalPedidos;
    private Long pedidosConfirmados;
    private Long pedidosRechazados;
    private Long montoTotalVentas;

}
