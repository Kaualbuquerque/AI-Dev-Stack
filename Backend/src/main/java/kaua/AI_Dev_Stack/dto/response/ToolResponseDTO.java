package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Schema(description = "Detailed data of an AI resource as returned by the API.")
public record ToolResponseDTO(

        @Schema(description = "The name or title of the AI tool.", example = "Claude AI")
        String name, // Use 'title' para bater com sua interface TS 'Tools'

        @Schema(description = "A short summary of the tool's features.", example = "High-performance AI model...")
        String description,

        @Schema(description = "Direct link to the tool's official website.", example = "https://anthropic.com")
        String url,

        @Schema(description = "Public URL of the tool's preview image or logo.", example = "https://images.com/logo.jpg")
        String thumbnailUrl,

        @Schema(description = "The business model of the tool.", example = "FREEMIUM")
        PricingType pricingModel,

        @Schema(description = "The technical platform or interface type.", example = "Web App")
        String toolType, // Aqui você passará o displayValue do Enum

        @Schema(description = "Indicates if the tool is highlighted.", example = "true")
        boolean featured,

        @Schema(description = "Indicates if the authenticated user upvoted this.", example = "false")
        boolean votedByMe,

        @Schema(description = "Total number of upvotes.", example = "42")
        int upvotesCount,

        @Schema(description = "List of categories this resource belongs to.")
        List<CategoryResponseDTO> categories // Mudamos de CategoryResponseDTO[] para List e pluralizamos

) {
}