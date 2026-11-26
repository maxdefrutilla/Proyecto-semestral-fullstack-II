package cl.inmaqui.ventas.dto;

import lombok.Data;

@Data
public class CatalogoProductoDto {

    private Long id;
    private String codigo;
    private String nombre;
    private Long precio;
    private Long stock;
    private Boolean activo;

}
