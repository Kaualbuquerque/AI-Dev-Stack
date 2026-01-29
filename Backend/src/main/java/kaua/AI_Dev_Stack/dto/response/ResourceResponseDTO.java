package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kaua.AI_Dev_Stack.model.Enums.PricingType;

import java.util.Set;
import java.util.UUID;

@Schema(description = "Detailed data of an AI resource as returned by the API.")
public record ResourceResponseDTO(

        @Schema(
                description = "Unique identifier (UUID) of the resource.",
                example = "724cf048-9f33-4f90-8910-449e7b23c72b")
        UUID id,

        @Schema(
                description = "The name or title of the AI tool.",
                example = "Claude AI")
        String title,

        @Schema(
                description = "URL-friendly version of the title.",
                example = "claude-ai")
        String slug,

        @Schema(
                description = "A short summary of the tool's features.",
                example = "High-performance AI model for complex reasoning tasks.")
        String description,

        @Schema(
                description = "Direct link to the tool's official website.",
                example = "https://anthropic.com")
        String url,

        @Schema(
                description = "Public URL of the tool's preview image or logo.",
                example = "https://images.com/claude-logo.jpg")
        String thumbnailUrl,

        @Schema(
                description = "The business model of the tool.",
                example = "FREEMIUM")
        PricingType pricingModel,

        @Schema(
                description = "The name of the category this resource belongs to.",
                example = "Chatbots")
        String categoryName,

        @Schema(
                description = "A set of tag names associated with this resource.",
                example = "[\"NLP\", \"Anthropic\", \"AI Writing\"]")
        Set<String> tags
) {
}