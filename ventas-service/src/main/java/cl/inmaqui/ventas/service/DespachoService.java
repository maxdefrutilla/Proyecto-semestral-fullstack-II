package cl.inmaqui.ventas.service;

import cl.inmaqui.ventas.entity.TipoEntrega;
import cl.inmaqui.ventas.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class DespachoService {

    private static final Set<String> COMUNAS_RM = Set.of(
            "ALHUE", "BUIN", "CALERA DE TANGO", "CERRILLOS", "CERRO NAVIA", "COLINA", "CONCHALI",
            "CURACAVI", "EL BOSQUE", "EL MONTE", "ESTACION CENTRAL", "HUECHURABA", "INDEPENDENCIA",
            "ISLA DE MAIPO", "LA CISTERNA", "LA FLORIDA", "LA GRANJA", "LA PINTANA", "LA REINA",
            "LAMPA", "LAS CONDES", "LO BARNECHEA", "LO ESPEJO", "LO PRADO", "MACUL", "MAIPU",
            "MARIA PINTO", "MELIPILLA", "NUNOA", "PADRE HURTADO", "PAINE", "PEDRO AGUIRRE CERDA",
            "PENAFLOR", "PENALOLEN", "PIRQUE", "PROVIDENCIA", "PUDAHUEL", "PUENTE ALTO", "QUILICURA",
            "QUINTA NORMAL", "RECOLETA", "RENCA", "SAN BERNARDO", "SAN JOAQUIN", "SAN JOSE DE MAIPO",
            "SAN MIGUEL", "SAN PEDRO", "SAN RAMON", "SANTIAGO", "TALAGANTE", "TILTIL", "VITACURA"
    );

    public void validarDespacho(TipoEntrega tipoEntrega, String direccion, String comuna) {
        if (tipoEntrega == TipoEntrega.DESPACHO) {
            if (direccion == null || direccion.trim().isBlank()) {
                throw new BadRequestException("La dirección es obligatoria para envíos a domicilio (DESPACHO)");
            }
            if (comuna == null || comuna.trim().isBlank()) {
                throw new BadRequestException("La comuna es obligatoria para envíos a domicilio (DESPACHO)");
            }
            String comunaLimpia = comuna.trim().toUpperCase()
                    .replace("Ñ", "N").replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U");

            if (!COMUNAS_RM.contains(comunaLimpia)) {
                throw new BadRequestException("Los despachos solo tienen cobertura dentro de la Región Metropolitana. Comuna no válida: " + comuna);
            }
        }
    }

    public long calcularCosto(TipoEntrega tipoEntrega, long subtotal) {
        if (tipoEntrega == TipoEntrega.RETIRO) {
            return 0L;
        }
        return (subtotal < 1000000L) ? 50000L : 100000L;
    }
}