package kaua.AI_Dev_Stack.dto.response;

import java.util.UUID;

public record TagResponseDTO(
        UUID id,
        String name,
        Long usageCount // "Essa tag é usada em 45 IAs"
) {
}
