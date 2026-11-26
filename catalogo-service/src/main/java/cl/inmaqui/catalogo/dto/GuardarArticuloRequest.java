package cl.inmaqui.catalogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record GuardarArticuloRequest(
        @NotBlank @Size(max = 120) @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*") String slug,
        @NotBlank @Size(max = 160) String titulo,
        @NotBlank @Size(max = 400) String resumen,
        @NotBlank @Size(max = 100000) String contenidoHtml,
        @Size(max = 255) String imagen) {
}
