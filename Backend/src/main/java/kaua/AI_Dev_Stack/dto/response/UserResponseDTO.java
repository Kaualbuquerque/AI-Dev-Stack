package kaua.AI_Dev_Stack.dto.response;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String email,
        String username,
        LocalDateTime createdAt,
        Set<UUID> upvotedResourceIds
) {
}
