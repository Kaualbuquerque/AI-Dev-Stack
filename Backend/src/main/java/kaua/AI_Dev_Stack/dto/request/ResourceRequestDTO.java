package kaua.AI_Dev_Stack.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import org.hibernate.validator.constraints.URL;

import java.util.List;
import java.util.UUID;

@Schema(description = "Payload for registering or updating an AI resource (tool)")
public record ResourceRequestDTO(

        @Schema(
                description = "The name/title of the AI tool",
                example = "ChatGPT",
                minLength = 3,
                maxLength = 100)
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @Schema(
                description = "A short summary of the tool for list views",
                example = "Advanced AI language model for conversation")
        @NotBlank(message = "Description is required")
        @Size(max = 255)
        String description,

        @Schema(
                description = "Detailed information about features, use cases, and technical specs",
                example = "ChatGPT is a sibling model to InstructGPT, which is trained to follow an instruction in a prompt...")
        String longDescription,

        @Schema(
                description = "Official website URL of the AI tool",
                example = "https://openai.com/chatgpt")
        @NotBlank(message = "URL is required")
        @URL(message = "Invalid URL format")
        String url,

        @Schema(
                description = "Link to a preview image or logo of the tool",
                example = "https://example.com/chatgpt-logo.png")
        @URL(message = "Invalid thumbnail URL format")
        String thumbnailUrl,

        @Schema(
                description = "Pricing model classification (e.g., FREE, FREEMIUM, PAID)")
        @NotNull(message = "Pricing model is required")
        PricingType pricingModel,

        @Schema(
                description = "The unique identifier of the category this tool belongs to")
        @NotNull(message = "Category ID is required")
        UUID categoryId,

        @Schema(
                description = "List of tag names to be associated with this resource. New tags will be created if they don't exist",
                example = "[\"LLM\", \"Chatbot\", \"NLP\"]")
        List<String> tags
) {
}