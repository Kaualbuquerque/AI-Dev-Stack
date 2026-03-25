package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Data representation of a category returned by the system.")
public record TagResponseDTO(

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
