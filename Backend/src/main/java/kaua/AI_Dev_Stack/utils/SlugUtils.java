package kaua.AI_Dev_Stack.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtils {

    public static String generateSlug(String title) {
        if (title == null) return "";

        // 1. Transforma em minúsculo
        String base = title.toLowerCase().trim();

        // 2. Normaliza (Separa o caractere do acento, ex: 'á' vira 'a' + '´')
        String normalize = Normalizer.normalize(base, Normalizer.Form.NFD);

        // 3. Usa Regex para remover os acentos (combining marks)
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String wihtoutAccents = pattern.matcher(normalize).replaceAll("");

        // 4. Remove qualquer coisa que não seja letra, número ou espaço, e troca espaços por hífens
        return wihtoutAccents
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-"); // Evita múltiplos hífens seguidos
    }
}
