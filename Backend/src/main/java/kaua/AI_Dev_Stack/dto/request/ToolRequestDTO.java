package kaua.AI_Dev_Stack.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;
import org.hibernate.validator.constraints.URL;

import java.util.List;
import java.util.UUID;

@Schema(description = "Payload for registering or updating an AI resource (tool)")
public record ToolRequestDTO(

        @Schema(description = "The name of the AI tool", example = "ChatGPT")
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 100)
        String name,

        @Schema(description = "A short summary of the tool", example = "Advanced AI language model")
        @NotBlank(message = "Description is required")
        @Size(max = 255)
        String description,

        @Schema(description = "Official website URL", example = "https://openai.com/chatgpt")
        @NotBlank(message = "URL is required")
        @URL(message = "Invalid URL format")
        String url,

        @Schema(description = "Link to a preview image", example = "https://example.com/logo.png")
        @URL(message = "Invalid thumbnail URL format")
        String thumbnailUrl,

        @Schema(description = "Pricing model classification")
        @NotNull(message = "Pricing model is required")
        PricingType pricingModel,

        @Schema(description = "The specific type of tool (e.g., WEB, MOBILE)")
        @NotNull(message = "Tool type is required")
        ToolType toolType,

        @Schema(description = "Whether the tool should be featured", example = "false")
        boolean featured,

        @Schema(description = "List of category IDs this tool belongs to")
        @NotEmpty(message = "At least one category ID is required")
        List<UUID> categoryIds
) {
}