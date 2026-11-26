package cl.inmaqui.catalogo.repository;

import cl.inmaqui.catalogo.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Producto p WHERE p.id = :id")
    Optional<Producto> bloquearPorId(@Param("id") Long id);

    Optional<Producto> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);

    List<Producto> findByActivoTrue();
    List<Producto> findByCategoriaCodigoAndActivoTrue(String categoriaCodigo);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.categoria.activo = true AND " +
           "(:categoria IS NULL OR LOWER(p.categoria.codigo) = LOWER(:categoria)) AND " +
           "(:busqueda IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    List<Producto> buscarActivos(@Param("categoria") String categoria, @Param("busqueda") String busqueda);

    @Query("SELECT p FROM Producto p WHERE " +
           "(:categoria IS NULL OR LOWER(p.categoria.codigo) = LOWER(:categoria)) AND " +
           "(:busqueda IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    List<Producto> buscarTodos(@Param("categoria") String categoria, @Param("busqueda") String busqueda);
}
