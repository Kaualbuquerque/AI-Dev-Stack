package kaua.AI_Dev_Stack.dto.response;

import java.util.UUID;

public record CategoryResponseDTO(
        UUID id,
        String name,
        String slug,
        String iconKey
) {
}
