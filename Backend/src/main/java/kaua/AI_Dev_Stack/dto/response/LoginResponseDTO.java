package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Authentication response containing the JWT token and basic user information.")
public record LoginResponseDTO(

        @Schema(
                description = "JWT token to be used in subsequent authenticated requests.",
                example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSJ9.asdf1234")
        String token,

        @Schema(
                description = "Authenticated user email address.",
                example = "developer@aidevstack.com")
        String email,

        @Schema(
                description = "Authenticated user display name.",
                example = "ai_explorer_2024")
        String username
) {
}
