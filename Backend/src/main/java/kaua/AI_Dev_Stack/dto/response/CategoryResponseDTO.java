package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Data representation of a category returned by the system.")
public record CategoryResponseDTO(

        @Schema(
                description = "Unique identifier (UUID) of the category.",
                example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(
                description = "Display name of the category.",
                example = "Image Generators")
        String name,

        @Schema(
                description = "URL-friendly version of the category name.",
                example = "image-generators")
        String slug,

        @Schema(
                description = "Icon identifier for frontend rendering.",
                example = "image-icon")
        String iconKey
) {
}
