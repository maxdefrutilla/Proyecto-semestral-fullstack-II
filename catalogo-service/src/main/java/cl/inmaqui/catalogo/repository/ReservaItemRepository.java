package cl.inmaqui.catalogo.repository;

import cl.inmaqui.catalogo.entity.ReservaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaItemRepository extends JpaRepository<ReservaItem, Long> {
    List<ReservaItem> findByReservaId(Long reservaId);
}
