package cl.inmaqui.catalogo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion_html", columnDefinition = "TEXT")
    private String descripcionHtml;

    @Column(name = "tipo_atributos", nullable = false, length = 30)
    private String tipoAtributos;

    @Column(nullable = false)
    private Boolean activo = true;
}
