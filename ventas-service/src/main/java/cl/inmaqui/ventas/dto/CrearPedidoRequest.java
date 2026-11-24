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

    private String telefono;

    @NotNull(message = "El tipo de entrega es obligatorio")
    private TipoEntrega tipoEntrega;

    private String direccion;
    private String comuna;
    private String observaciones;

    @NotBlank(message = "La clave de operación es obligatoria")
    private String claveOperacion; 

    private String resultadoPagoPrueba; 

    @NotEmpty(message = "El pedido debe contener al menos un producto")
    @Valid
    private List<ItemPedidoRequest> items;

}