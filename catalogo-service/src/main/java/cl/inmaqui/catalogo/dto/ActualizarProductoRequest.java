package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ActualizarProductoRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120)
    private String nombre;

    @NotNull(message = "El ID de categoría es obligatorio")
    private Long categoriaId;

    @NotBlank(message = "La descripción HTML es obligatoria")
    private String descripcionHtml;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private Long precio;

    @Positive(message = "El precio anterior debe ser mayor a 0")
    private Long precioAnterior;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock debe ser mayor o igual a 0")
    private Integer stock;

    private String imagen;

    @NotNull(message = "Los atributos son obligatorios")
    private Object atributos;
}
