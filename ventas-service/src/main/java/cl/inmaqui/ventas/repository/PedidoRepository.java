package cl.inmaqui.ventas.repository;

import cl.inmaqui.ventas.entity.EstadoPedido;
import cl.inmaqui.ventas.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Pedido p WHERE p.claveOperacion = :clave")
    Optional<Pedido> bloquearPorClave(@org.springframework.data.repository.query.Param("clave") String clave);

    Optional<Pedido> findByClaveOperacion(String claveOperacion);
    List<Pedido> findByUsuarioIdOrderByCreadoEnDesc(Long usuarioId);
    List<Pedido> findAllByOrderByCreadoEnDesc();
    long countByEstado(EstadoPedido estado);

}