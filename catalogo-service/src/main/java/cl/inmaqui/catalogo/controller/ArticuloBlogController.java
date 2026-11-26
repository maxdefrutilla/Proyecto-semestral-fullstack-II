package cl.inmaqui.catalogo.controller;

import cl.inmaqui.catalogo.dto.GuardarArticuloRequest;
import cl.inmaqui.catalogo.entity.ArticuloBlog;
import cl.inmaqui.catalogo.service.ArticuloBlogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogo")
@Tag(name = "Blog")
public class ArticuloBlogController {
    private final ArticuloBlogService blog;

    public ArticuloBlogController(ArticuloBlogService blog) {
        this.blog = blog;
    }

    @GetMapping("/blog")
    public List<ArticuloBlog> listar() {
        return blog.listar(false);
    }

    @GetMapping("/blog/{slug}")
    public ArticuloBlog detalle(@PathVariable String slug) {
        return blog.buscarPublicado(slug);
    }

    @GetMapping("/admin/blog")
    public List<ArticuloBlog> administrar() {
        return blog.listar(true);
    }

    @PostMapping("/blog")
    @ResponseStatus(HttpStatus.CREATED)
    public ArticuloBlog crear(@Valid @RequestBody GuardarArticuloRequest datos) {
        return blog.guardar(null, datos);
    }

    @PutMapping("/blog/{id}")
    public ArticuloBlog editar(@PathVariable Long id, @Valid @RequestBody GuardarArticuloRequest datos) {
        return blog.guardar(id, datos);
    }

    @PatchMapping("/blog/{id}/estado")
    public ArticuloBlog publicar(@PathVariable Long id, @Valid @RequestBody EstadoArticulo estado) {
        return blog.publicar(id, estado.publicado());
    }

    public record EstadoArticulo(@NotNull Boolean publicado) {}
}
