package cl.inmaqui.catalogo.service;

import cl.inmaqui.catalogo.dto.*;
import cl.inmaqui.catalogo.entity.Categoria;
import cl.inmaqui.catalogo.entity.Producto;
import cl.inmaqui.catalogo.exception.BadRequestException;
import cl.inmaqui.catalogo.exception.ConflictException;
import cl.inmaqui.catalogo.exception.ResourceNotFoundException;
import cl.inmaqui.catalogo.repository.CategoriaRepository;
import cl.inmaqui.catalogo.repository.ProductoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final HtmlSanitizerService htmlSanitizerService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository,
                           HtmlSanitizerService htmlSanitizerService) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.htmlSanitizerService = htmlSanitizerService;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(String categoria, String busqueda, boolean incluirInactivos) {
        List<Producto> productos = incluirInactivos
                ? productoRepository.buscarTodos(categoria, busqueda)
                : productoRepository.buscarActivos(categoria, busqueda);

        return productos.stream().map(ProductoResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return ProductoResponse.fromEntity(p);
    }

    @Transactional
    public ProductoResponse crear(CrearProductoRequest req) {
        if (productoRepository.existsByCodigo(req.getCodigo().trim())) {
            throw new ConflictException("Ya existe un producto con el código: " + req.getCodigo());
        }

        Categoria categoria = categoriaRepository.findById(req.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + req.getCategoriaId()));

        validarPrecios(req.getPrecio(), req.getPrecioAnterior());
        String atributosJson = serializarAtributos(req.getAtributos());

        Producto p = new Producto();
        p.setCodigo(req.getCodigo().trim());
        p.setNombre(req.getNombre().trim());
        p.setCategoria(categoria);
        p.setDescripcionHtml(htmlSanitizerService.sanitizar(req.getDescripcionHtml()));
        p.setPrecio(req.getPrecio());
        p.setPrecioAnterior(req.getPrecioAnterior());
        p.setStock(req.getStock());
        p.setImagen(req.getImagen());
        p.setAtributos(atributosJson);
        p.setActivo(true);

        return ProductoResponse.fromEntity(productoRepository.save(p));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ActualizarProductoRequest req) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        Categoria categoria = categoriaRepository.findById(req.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + req.getCategoriaId()));

        validarPrecios(req.getPrecio(), req.getPrecioAnterior());
        String atributosJson = serializarAtributos(req.getAtributos());

        p.setNombre(req.getNombre().trim());
        p.setCategoria(categoria);
        p.setDescripcionHtml(htmlSanitizerService.sanitizar(req.getDescripcionHtml()));
        p.setPrecio(req.getPrecio());
        p.setPrecioAnterior(req.getPrecioAnterior());
        p.setStock(req.getStock());
        p.setImagen(req.getImagen());
        p.setAtributos(atributosJson);

        return ProductoResponse.fromEntity(productoRepository.save(p));
    }

    @Transactional
    public ProductoResponse cambiarEstado(Long id, Boolean activo) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        p.setActivo(activo);
        return ProductoResponse.fromEntity(productoRepository.save(p));
    }

    @Transactional
    public void eliminarLogico(Long id) {
        cambiarEstado(id, false);
    }

    @Transactional(readOnly = true)
    public CalculadoraAndamiosResponse calcularAndamios(CalculadoraAndamiosRequest req) {
        Producto p = productoRepository.findById(req.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto andamio no encontrado con ID: " + req.getProductoId()));

        if (!p.getActivo() || !p.getCategoria().getCodigo().equalsIgnoreCase("andamios")) {
            throw new BadRequestException("El producto seleccionado no es un andamio activo");
        }

        double anchoModulo = 2.0;
        double altoModulo = 1.0;

        try {
            JsonNode root = objectMapper.readTree(p.getAtributos());
            if (root.has("anchoModuloMetros")) anchoModulo = root.get("anchoModuloMetros").asDouble(2.0);
            if (root.has("altoModuloMetros")) altoModulo = root.get("altoModuloMetros").asDouble(1.0);
        } catch (Exception ignored) {}

        int columnas = (int) Math.ceil(req.getLargoMetros() / anchoModulo);
        int filas = (int) Math.ceil(req.getAltoMetros() / altoModulo);
        int cantidad = columnas * filas;
        long subtotal = (long) cantidad * p.getPrecio();

        String aviso = "Aproximación comercial referencial. No constituye certificación técnica ni verificación estructural de faena.";
        if (cantidad > p.getStock()) {
            aviso += " Aviso: La cantidad calculada (" + cantidad + ") supera el stock disponible en bodega (" + p.getStock() + ").";
        }

        return CalculadoraAndamiosResponse.builder()
                .productoId(p.getId())
                .columnas(columnas)
                .filas(filas)
                .cantidad(cantidad)
                .precioUnitario(p.getPrecio())
                .subtotal(subtotal)
                .aviso(aviso)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> calcularAscensores(CalculadoraAscensoresRequest req) {
        List<Producto> ascensores = productoRepository.findByCategoriaCodigoAndActivoTrue("ascensores");
        List<ProductoResponse> compatibles = new ArrayList<>();

        for (Producto p : ascensores) {
            try {
                JsonNode root = objectMapper.readTree(p.getAtributos());
                double alturaMax = root.has("alturaMaxMetros") ? root.get("alturaMaxMetros").asDouble(0) : 0;
                int capacidadKg = root.has("capacidadKg") ? root.get("capacidadKg").asInt(0) : 0;

                if (alturaMax >= req.getAlturaMetros() && capacidadKg >= req.getCapacidadKg()) {
                    compatibles.add(ProductoResponse.fromEntity(p));
                }
            } catch (Exception ignored) {}
        }

        return compatibles;
    }

    private void validarPrecios(Long precio, Long precioAnterior) {
        if (precioAnterior != null && precioAnterior <= precio) {
            throw new BadRequestException("En ofertas, el precio anterior debe ser mayor al precio de oferta actual");
        }
    }

    private String serializarAtributos(Object attrs) {
        if (attrs instanceof String s) return s;
        try {
            return objectMapper.writeValueAsString(attrs);
        } catch (Exception e) {
            throw new BadRequestException("Formato de atributos inválido");
        }
    }
}
