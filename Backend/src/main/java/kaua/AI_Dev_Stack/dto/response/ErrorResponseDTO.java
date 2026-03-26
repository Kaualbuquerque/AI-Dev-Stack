package kaua.AI_Dev_Stack.dto.response;

import java.time.LocalDateTime;

public record ErrorResponseDTO(
        LocalDateTime timeStamp,
        int status,
        String error,
        String message
) {
}
