package cl.inmaqui.usuarios.service;

import cl.inmaqui.usuarios.entity.Usuario;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final RSAPrivateKey privateKey;
    private final String issuer;
    private final long expirationMinutes;

    public JwtService(RSAPrivateKey privateKey,
                      @Value("${app.jwt.issuer}") String issuer,
                      @Value("${app.jwt.expiration-minutes}") long expirationMinutes) {
        this.privateKey = privateKey;
        this.issuer = issuer;
        this.expirationMinutes = expirationMinutes;
    }

    public String generarToken(Usuario usuario) {
        try {
            Instant ahora = Instant.now();
            Instant expiracion = ahora.plus(expirationMinutes, ChronoUnit.MINUTES);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .issuer(issuer)
                    .subject(usuario.getId().toString())
                    .claim("usuario", usuario.getUsuario())
                    .claim("rol", usuario.getRol().name())
                    .claim("rut", usuario.getRut())
                    .claim("nombreCompleto", usuario.getNombre() + " " + usuario.getApellidos())
                    .issueTime(Date.from(ahora))
                    .expirationTime(Date.from(expiracion))
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.RS256).build(),
                    claimsSet
            );

            signedJWT.sign(new RSASSASigner(privateKey));
            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el token JWT", e);
        }
    }
    
}