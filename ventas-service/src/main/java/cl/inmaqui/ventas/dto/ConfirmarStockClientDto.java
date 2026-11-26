package cl.inmaqui.ventas.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmarStockClientDto {

    private Long pedidoId;
    private List<ItemStock> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemStock {
        
        private Long productoId;
        private Integer cantidad;
        private Long precioUnitario;

    }

}
