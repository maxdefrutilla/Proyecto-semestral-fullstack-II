package cl.inmaqui.catalogo.dto;

import cl.inmaqui.catalogo.entity.Producto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductoResponse {
    private Long id;
    private String codigo;
    private String nombre;
    private String categoria;      // Código de la categoría
    private Long categoriaId;     // FK de la categoría
    private String descripcionHtml;
    private Long precio;
    private Long precioAnterior;
    private Integer stock;
    private String imagen;
    private Object atributos;
    private Boolean activo;
    private LocalDateTime creadoEn;

    public static ProductoResponse fromEntity(Producto p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .codigo(p.getCodigo())
                .nombre(p.getNombre())
                .categoria(p.getCategoria().getCodigo())
                .categoriaId(p.getCategoria().getId())
                .descripcionHtml(p.getDescripcionHtml())
                .precio(p.getPrecio())
                .precioAnterior(p.getPrecioAnterior())
                .stock(p.getStock())
                .imagen(p.getImagen())
                .atributos(p.getAtributos())
                .activo(p.getActivo())
                .creadoEn(p.getCreadoEn())
                .build();
    }
}
