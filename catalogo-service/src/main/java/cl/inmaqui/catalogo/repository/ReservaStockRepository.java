package cl.inmaqui.catalogo.repository;

import cl.inmaqui.catalogo.entity.ReservaStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservaStockRepository extends JpaRepository<ReservaStock, Long> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    Optional<ReservaStock> findByPedidoId(Long pedidoId);
    boolean existsByPedidoId(Long pedidoId);
}
