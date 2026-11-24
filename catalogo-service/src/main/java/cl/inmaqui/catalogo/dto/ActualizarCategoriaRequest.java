package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ActualizarCategoriaRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String nombre;

    private String descripcionHtml;

    @NotBlank(message = "El tipo de atributos es obligatorio")
    @Size(max = 30)
    private String tipoAtributos;
}
