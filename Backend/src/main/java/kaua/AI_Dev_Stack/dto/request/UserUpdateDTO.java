package kaua.AI_Dev_Stack.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Data for updating the authenticated user profile.")
public record UserUpdateDTO(

        @Schema(
                description = "New display name for the community profile.",
                example = "new_username",
                minLength = 3,
                maxLength = 20)
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        String username,

        @Schema(
                description = "New password for the account.",
                example = "newP@ssw0rd",
                minLength = 6,
                format = "password")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {}
