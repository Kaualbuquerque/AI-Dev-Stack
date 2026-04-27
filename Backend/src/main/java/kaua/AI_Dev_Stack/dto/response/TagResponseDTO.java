package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Data representation of a tag returned by the system.")
public record TagResponseDTO(
        @Schema(
                description = "Unique identifier of the tag",
                example = "123e4567-e89b-12d3-a456-426614174000"
        )
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
