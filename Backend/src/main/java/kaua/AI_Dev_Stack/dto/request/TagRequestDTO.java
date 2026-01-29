package kaua.AI_Dev_Stack.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Data required to identify or register a technology tag")
public record TagRequestDTO(

        @Schema(
                description = "The unique name of the tag. It will be used to search for an existing tag or create a new one",
                example = "Stable Diffusion",
                minLength = 2,
                maxLength = 100
        )
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name
) {
}
