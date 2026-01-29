package kaua.AI_Dev_Stack.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "Information required to register a new user in the platform.")
public record UserRequestDTO(

        @Schema(
                description = "Primary email address for account recovery and notifications.",
                example = "dev.stack@example.com")
        @NotBlank(message = "Email is required")
        @Email
        String email,

        @Schema(
                description = "Unique display name for the community profile.",
                example = "ai_explorer_2024",
                minLength = 3,
                maxLength = 20)
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        String username,

        @Schema(
                description = "Secure password for the account. Will be encrypted before storage.",
                example = "s3cureP@ssw0rd",
                minLength = 6,
                format = "password"
        )
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {
}