package kaua.AI_Dev_Stack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UserRequestDTO(

        @NotBlank(message = "Email is required")
        @Email
        String email,

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Username must be at least 6 characters")
        String password
) {}
