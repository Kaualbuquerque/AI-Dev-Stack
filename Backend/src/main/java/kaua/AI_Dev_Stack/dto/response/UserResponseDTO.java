package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Schema(description = "Public and administrative data representation of a user.")
public record UserResponseDTO(

        @Schema(
                description = "Unique identifier (UUID) of the user.",
                example = "123e4567-e89b-12d3-a456-426614174000")
        UUID id,

        @Schema(
                description = "Registered email address.",
                example = "developer@aidevstack.com")
        String email,

        @Schema(
                description = "Unique community display name.",
                example = "ai_wizard")
        String username,

        @Schema(
                description = "Timestamp of when the account was created.")
        LocalDateTime createdAt,

        @Schema(
                description = "A set of Resource IDs that this user has upvoted.",
                example = "[\"724cf048-9f33-4f90-8910-449e7b23c72b\", \"550e8400-e29b-41d4-a716-446655440000\"]")
        Set<UUID> upvotedResourceIds
) {
}