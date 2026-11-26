package cl.inmaqui.ventas.dto;

import cl.inmaqui.ventas.entity.TipoEntrega;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CrearPedidoRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 80)
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100)
    private String apellidos;

    @NotBlank(message = "El RUT es obligatorio")
    @Size(max = 12)
    private String rut;

    @NotBlank(message = "El correo es obligatorio")
    @Email
    @Size(max = 120)
    private String correo;

    @Size(max = 20)
    private String telefono;

    @NotNull(message = "El tipo de entrega es obligatorio")
    private TipoEntrega tipoEntrega;

    @Size(max = 255)
    private String direccion;
    @Size(max = 100)
    private String comuna;
    @Size(max = 500)
    private String observaciones;

    @NotBlank(message = "La clave de operación es obligatoria")
    @Pattern(regexp = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}")
    private String claveOperacion; 

    @NotBlank
    @Pattern(regexp = "APROBAR|RECHAZADO")
    private String resultadoPagoPrueba; 

    @NotEmpty(message = "El pedido debe contener al menos un producto")
    @Valid
    @Size(max = 100)
    private List<@NotNull ItemPedidoRequest> items;

}