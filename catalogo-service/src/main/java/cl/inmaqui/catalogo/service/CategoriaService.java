package cl.inmaqui.catalogo.service;

import cl.inmaqui.catalogo.dto.ActualizarCategoriaRequest;
import cl.inmaqui.catalogo.dto.CategoriaResponse;
import cl.inmaqui.catalogo.dto.CrearCategoriaRequest;
import cl.inmaqui.catalogo.entity.Categoria;
import cl.inmaqui.catalogo.exception.ConflictException;
import cl.inmaqui.catalogo.exception.ResourceNotFoundException;
import cl.inmaqui.catalogo.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final HtmlSanitizerService htmlSanitizerService;

    public CategoriaService(CategoriaRepository categoriaRepository, HtmlSanitizerService htmlSanitizerService) {
        this.categoriaRepository = categoriaRepository;
        this.htmlSanitizerService = htmlSanitizerService;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar(boolean incluirInactivos) {
        List<Categoria> list = incluirInactivos ? categoriaRepository.findAll() : categoriaRepository.findByActivoTrue();
        return list.stream().map(CategoriaResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtenerPorId(Long id) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
        return CategoriaResponse.fromEntity(cat);
    }

    @Transactional
    public CategoriaResponse crear(CrearCategoriaRequest req) {
        if (categoriaRepository.existsByCodigo(req.getCodigo().trim())) {
            throw new ConflictException("Ya existe una categoría con el código: " + req.getCodigo());
        }

        Categoria cat = new Categoria();
        cat.setCodigo(req.getCodigo().trim().toLowerCase());
        cat.setNombre(req.getNombre().trim());
        cat.setDescripcionHtml(htmlSanitizerService.sanitizar(req.getDescripcionHtml()));
        cat.setTipoAtributos(req.getTipoAtributos().trim().toUpperCase());
        cat.setActivo(true);

        return CategoriaResponse.fromEntity(categoriaRepository.save(cat));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, ActualizarCategoriaRequest req) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));

        cat.setNombre(req.getNombre().trim());
        cat.setDescripcionHtml(htmlSanitizerService.sanitizar(req.getDescripcionHtml()));
        cat.setTipoAtributos(req.getTipoAtributos().trim().toUpperCase());

        return CategoriaResponse.fromEntity(categoriaRepository.save(cat));
    }

    @Transactional
    public CategoriaResponse cambiarEstado(Long id, Boolean activo) {
        Categoria cat = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
        cat.setActivo(activo);
        return CategoriaResponse.fromEntity(categoriaRepository.save(cat));
    }

    @Transactional
    public void eliminarLogico(Long id) {
        cambiarEstado(id, false);
    }
}
