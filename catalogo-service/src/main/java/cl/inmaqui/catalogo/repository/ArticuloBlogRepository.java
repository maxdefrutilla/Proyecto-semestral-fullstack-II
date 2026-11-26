package cl.inmaqui.catalogo.repository;

import cl.inmaqui.catalogo.entity.ArticuloBlog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticuloBlogRepository extends JpaRepository<ArticuloBlog, Long> {
    List<ArticuloBlog> findByPublicadoTrueOrderByCreadoEnDescIdAsc();
    List<ArticuloBlog> findAllByOrderByCreadoEnDescIdAsc();
    Optional<ArticuloBlog> findBySlugAndPublicadoTrue(String slug);
}
