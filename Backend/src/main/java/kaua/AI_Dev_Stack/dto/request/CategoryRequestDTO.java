package kaua.AI_Dev_Stack.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Data required to create or update an AI resource category")
public record CategoryRequestDTO(

        @Schema(
                description = "Unique name of the category",
                example = "Code Assistants",
                minLength = 2,
                maxLength = 50
        )
        @NotBlank(message = "Category name is required")
        @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
        String name,

        @Schema(
                description = "Identifier or key for the category icon",
                example = "cpu-chip",
                maxLength = 100
        )
        @Size(max = 100)
        String iconKey
) {
}
