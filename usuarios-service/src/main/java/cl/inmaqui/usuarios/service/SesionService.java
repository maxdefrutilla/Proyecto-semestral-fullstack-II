package cl.inmaqui.usuarios.service;

import cl.inmaqui.usuarios.dto.LoginResponse;
import cl.inmaqui.usuarios.dto.UsuarioResponse;
import cl.inmaqui.usuarios.repository.UsuarioRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class SesionService {
    private final SecureRandom aleatorio = new SecureRandom();
    private final JdbcTemplate jdbc;
    private final UsuarioRepository usuarios;
    private final JwtService jwt;

    public SesionService(JdbcTemplate jdbc, UsuarioRepository usuarios, JwtService jwt) {
        this.jdbc = jdbc;
        this.usuarios = usuarios;
        this.jwt = jwt;
    }

    @Transactional
    public String iniciar(Long usuarioId, String anterior) {
        revocar(anterior);
        return crear(usuarioId);
    }

    @Transactional
    public Renovacion renovar(String token) {
        if (!formatoValido(token)) throw credencialesInvalidas();
        String hash = hash(token);
        Long id = jdbc.query("SELECT usuario_id FROM refresh_tokens " +
                        "WHERE token_hash = ? AND expira_en > UTC_TIMESTAMP() FOR UPDATE",
                (resultado, fila) -> resultado.getLong(1), hash)
                .stream().findFirst().orElseThrow(this::credencialesInvalidas);

        var usuario = usuarios.findById(id).filter(u -> Boolean.TRUE.equals(u.getActivo()))
                .orElseThrow(this::credencialesInvalidas);
        jdbc.update("DELETE FROM refresh_tokens WHERE token_hash = ?", hash);
        String nuevo = crear(id);
        return new Renovacion(nuevo, new LoginResponse(jwt.generarToken(usuario), "Bearer",
                UsuarioResponse.fromEntity(usuario)));
    }

    @Transactional
    public void revocar(String token) {
        if (formatoValido(token)) jdbc.update("DELETE FROM refresh_tokens WHERE token_hash = ?", hash(token));
    }

    private String crear(Long usuarioId) {
        byte[] bytes = new byte[32];
        aleatorio.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        jdbc.update("INSERT INTO refresh_tokens (token_hash, usuario_id, expira_en) " +
                "VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))", hash(token), usuarioId);
        return token;
    }

    private boolean formatoValido(String token) {
        return token != null && token.matches("[A-Za-z0-9_-]{43}");
    }

    private String hash(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.US_ASCII)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private BadCredentialsException credencialesInvalidas() {
        return new BadCredentialsException("Sesión expirada o inválida");
    }

    public record Renovacion(String token, LoginResponse login) {}
}
