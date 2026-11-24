package cl.inmaqui.catalogo.service;

import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.stereotype.Service;

@Service
public class HtmlSanitizerService {

    private final PolicyFactory policy;

    public HtmlSanitizerService() {
        // Permite texto con formato (<p>, <strong>, <em>, <h1>, <h2>), listas (<ul>, <ol>, <li>) y enlaces seguros (<a> con href http/https)
        this.policy = Sanitizers.FORMATTING
                .and(Sanitizers.BLOCKS)
                .and(Sanitizers.LINKS);
    }

    public String sanitizar(String html) {
        if (html == null) return null;
        return policy.sanitize(html);
    }
}
