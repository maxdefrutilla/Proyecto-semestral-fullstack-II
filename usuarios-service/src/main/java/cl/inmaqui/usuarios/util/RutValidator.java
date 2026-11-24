package cl.inmaqui.usuarios.util;

public final class RutValidator {

    private RutValidator() {}

    public static String normalizar(String rut) {
        if (rut == null) return null;
        String limpio = rut.replace(".", "").replace(" ", "").trim().toUpperCase();
        if (!limpio.contains("-") && limpio.length() >= 2) {
            limpio = limpio.substring(0, limpio.length() - 1) + "-" + limpio.substring(limpio.length() - 1);
        }
        return limpio;
    }


    public static boolean esValido(String rut) {
        if (rut == null) return false;
        String normalizado = normalizar(rut);
        String[] partes = normalizado.split("-");
        if (partes.length != 2) return false;

        String cuerpo = partes[0];
        String dv = partes[1];

        if (!cuerpo.matches("^[0-9]{7,8}$") || !dv.matches("^[0-9K]$")) {
            return false;
        }

        try {
            int suma = 0;
            int multiplo = 2;
            for (int i = cuerpo.length() - 1; i >= 0; i--) {
                suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplo;
                multiplo = (multiplo == 7) ? 2 : multiplo + 1;
            }

            int resto = 11 - (suma % 11);
            String dvEsperado;
            if (resto == 11) {
                dvEsperado = "0";
            } else if (resto == 10) {
                dvEsperado = "K";
            } else {
                dvEsperado = String.valueOf(resto);
            }

            return dv.equalsIgnoreCase(dvEsperado);
        } catch (Exception e) {
            return false;
        }
    }

}