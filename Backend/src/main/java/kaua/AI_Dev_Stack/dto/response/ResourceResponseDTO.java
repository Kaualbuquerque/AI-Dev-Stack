package kaua.AI_Dev_Stack.dto.response;

import kaua.AI_Dev_Stack.model.Enums.PricingType;

import java.util.Set;
import java.util.UUID;

public record ResourceResponseDTO(
        UUID id,
        String title,
        String slug,
        String description,
        String url,
        String thumbnailUrl,
        PricingType pricingModel,
        String categoryName, // Simplificamos o objeto Category para apenas uma String
        Set<String> tags    // Simplificamos a lista de Objetos Tag para apenas nomes
) {
}
