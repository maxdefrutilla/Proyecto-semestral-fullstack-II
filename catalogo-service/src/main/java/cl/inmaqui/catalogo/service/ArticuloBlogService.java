package cl.inmaqui.catalogo.service;

import cl.inmaqui.catalogo.dto.GuardarArticuloRequest;
import cl.inmaqui.catalogo.entity.ArticuloBlog;
import cl.inmaqui.catalogo.exception.BadRequestException;
import cl.inmaqui.catalogo.exception.ResourceNotFoundException;
import cl.inmaqui.catalogo.repository.ArticuloBlogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticuloBlogService {
    private final ArticuloBlogRepository articulos;
    private final HtmlSanitizerService html;

    public ArticuloBlogService(ArticuloBlogRepository articulos, HtmlSanitizerService html) {
        this.articulos = articulos;
        this.html = html;
    }

    @Transactional(readOnly = true)
    public List<ArticuloBlog> listar(boolean administracion) {
        return administracion ? articulos.findAllByOrderByCreadoEnDescIdAsc()
                : articulos.findByPublicadoTrueOrderByCreadoEnDescIdAsc();
    }

    @Transactional(readOnly = true)
    public ArticuloBlog buscarPublicado(String slug) {
        return articulos.findBySlugAndPublicadoTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Artículo no disponible"));
    }

    @Transactional
    public ArticuloBlog guardar(Long id, GuardarArticuloRequest datos) {
        ArticuloBlog articulo = id == null ? new ArticuloBlog() : buscar(id);
        String contenido = html.sanitizar(datos.contenidoHtml());
        if (contenido.replaceAll("<[^>]*>", "").replace("&#160;", "").isBlank()) {
            throw new BadRequestException("El artículo debe tener contenido");
        }
        articulo.setSlug(datos.slug());
        articulo.setTitulo(datos.titulo().trim());
        articulo.setResumen(datos.resumen().trim());
        articulo.setContenidoHtml(contenido);
        articulo.setImagen(datos.imagen());
        return articulos.saveAndFlush(articulo);
    }

    @Transactional
    public ArticuloBlog publicar(Long id, boolean publicado) {
        ArticuloBlog articulo = buscar(id);
        articulo.setPublicado(publicado);
        return articulos.saveAndFlush(articulo);
    }

    private ArticuloBlog buscar(Long id) {
        return articulos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artículo no disponible"));
    }
}
