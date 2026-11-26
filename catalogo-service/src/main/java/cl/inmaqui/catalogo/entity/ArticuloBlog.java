package cl.inmaqui.catalogo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "articulos_blog")
@Getter
@Setter
public class ArticuloBlog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 160)
    private String titulo;

    @Column(nullable = false, length = 400)
    private String resumen;

    @Column(name = "contenido_html", nullable = false, columnDefinition = "LONGTEXT")
    private String contenidoHtml;

    @Column(length = 255)
    private String imagen;

    @Column(nullable = false)
    private boolean publicado;

    @Column(nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @Column(nullable = false)
    private LocalDateTime actualizadoEn;

    @PrePersist
    void crearFechas() {
        creadoEn = actualizadoEn = LocalDateTime.now();
    }

    @PreUpdate
    void actualizarFecha() {
        actualizadoEn = LocalDateTime.now();
    }
}
