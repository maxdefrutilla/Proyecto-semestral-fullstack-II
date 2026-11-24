package cl.inmaqui.ventas.dto;

import cl.inmaqui.ventas.entity.PedidoItem;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PedidoItemResponse {

    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Long precioUnitario;
    private Integer cantidad;
    private Long subtotal;

    public static PedidoItemResponse fromEntity(PedidoItem item) {
        return PedidoItemResponse.builder()
                .id(item.getId())
                .productoId(item.getProductoId())
                .nombreProducto(item.getNombreProducto())
                .precioUnitario(item.getPrecioUnitario())
                .cantidad(item.getCantidad())
                .subtotal(item.getSubtotal())
                .build();
    }
    
}