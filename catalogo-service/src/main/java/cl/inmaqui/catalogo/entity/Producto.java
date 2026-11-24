package cl.inmaqui.catalogo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(name = "descripcion_html", nullable = false, columnDefinition = "TEXT")
    private String descripcionHtml;

    @Column(nullable = false)
    private Long precio;

    @Column(name = "precio_anterior")
    private Long precioAnterior;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 500)
    private String imagen;

    @Column(nullable = false, columnDefinition = "JSON")
    private String atributos;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        this.creadoEn = LocalDateTime.now();
        if (this.activo == null) this.activo = true;
    }
}
