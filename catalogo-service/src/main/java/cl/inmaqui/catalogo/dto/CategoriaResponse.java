package cl.inmaqui.catalogo.dto;

import cl.inmaqui.catalogo.entity.Categoria;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoriaResponse {
    private Long id;
    private String codigo;
    private String nombre;
    private String descripcionHtml;
    private String tipoAtributos;
    private Boolean activo;

    public static CategoriaResponse fromEntity(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .codigo(c.getCodigo())
                .nombre(c.getNombre())
                .descripcionHtml(c.getDescripcionHtml())
                .tipoAtributos(c.getTipoAtributos())
                .activo(c.getActivo())
                .build();
    }
}
