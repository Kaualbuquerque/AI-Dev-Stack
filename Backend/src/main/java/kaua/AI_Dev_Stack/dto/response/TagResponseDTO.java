package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Data representation of a tag, including its popularity metrics.")
public record TagResponseDTO(

        @Schema(
                description = "Unique identifier (UUID) of the tag.",
                example = "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6")
        UUID id,

        @Schema(
                description = "The display name of the tag.",
                example = "Machine Learning")
        String name,

        @Schema(
                description = "Total number of AI resources associated with this tag.",
                example = "45")
        Long usageCount
) {
}
