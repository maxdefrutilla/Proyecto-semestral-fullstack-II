package cl.inmaqui.ventas.dto;

import cl.inmaqui.ventas.entity.EstadoPedido;
import cl.inmaqui.ventas.entity.Pedido;
import cl.inmaqui.ventas.entity.TipoEntrega;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PedidoResponse {
    
    private Long id;
    private Long usuarioId;
    private String nombre;
    private String apellidos;
    private String rut;
    private String correo;
    private String telefono;
    private TipoEntrega tipoEntrega;
    private String direccion;
    private String comuna;
    private String observaciones;
    private Long subtotal;
    private Long costoDespacho;
    private Long total;
    private EstadoPedido estado;
    private String motivoRechazo;
    private LocalDateTime creadoEn;
    private List<PedidoItemResponse> items;

    public static PedidoResponse fromEntity(Pedido p) {
        return PedidoResponse.builder()
                .id(p.getId())
                .usuarioId(p.getUsuarioId())
                .nombre(p.getNombre())
                .apellidos(p.getApellidos())
                .rut(p.getRut())
                .correo(p.getCorreo())
                .telefono(p.getTelefono())
                .tipoEntrega(p.getTipoEntrega())
                .direccion(p.getDireccion())
                .comuna(p.getComuna())
                .observaciones(p.getObservaciones())
                .subtotal(p.getSubtotal())
                .costoDespacho(p.getCostoDespacho())
                .total(p.getTotal())
                .estado(p.getEstado())
                .motivoRechazo(p.getMotivoRechazo())
                .creadoEn(p.getCreadoEn())
                .items(p.getItems().stream().map(PedidoItemResponse::fromEntity).toList())
                .build();
    }

}