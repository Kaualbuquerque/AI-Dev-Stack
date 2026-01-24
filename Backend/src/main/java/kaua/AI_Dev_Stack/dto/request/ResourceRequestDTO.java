package kaua.AI_Dev_Stack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import org.hibernate.validator.constraints.URL;

import java.util.List;
import java.util.UUID;

public record ResourceRequestDTO(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 255)
        String description,

        String longDescription, // Pode ser opcional

        @NotBlank(message = "URL is required")
        @URL(message = "Invalid URL format")
        String url,

        @URL(message = "Invalid thumbnail URL format")
        String thumbnailUrl,

        @NotNull(message = "Pricing model is required")
        PricingType pricingModel,

        @NotNull(message = "Category ID is required")
        UUID categoryId,

        List<String> tags // Nomes das tags para o TagService processar
) {
}
