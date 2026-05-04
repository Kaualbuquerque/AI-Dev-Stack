package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.StackType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "Detailed data of an AI tool as returned by the API.")
public record ToolResponseDTO(

        @Schema(description = "Unique identifier of the tool.", example = "123e4567-e89b-12d3-a456-426614174000")
        UUID id,

        @Schema(description = "The name of the AI tool.", example = "Claude AI")
        String name,

        @Schema(description = "A short summary of the tool's features.", example = "High-performance AI model...")
        String description,

        @Schema(description = "Direct link to the tool's official website.", example = "https://anthropic.com")
        String url,

        @Schema(description = "Public URL of the tool's preview image or logo.", example = "https://images.com/logo.jpg")
        String thumbnailUrl,

        @Schema(description = "The business model of the tool.", example = "Free")
        PricingType pricingModel,

        @Schema(description = "The technical platform or interface type.", example = "web")
        ToolType toolType,

        @Schema(description = "Compatible technology stacks.", example = "[\"JAVA\", \"PYTHON\"]")
        List<StackType> stacks,

        @Schema(description = "Indicates if the tool is highlighted.", example = "true")
        boolean featured,

        @Schema(description = "Timestamp of when the tool was added.", example = "2024-01-15T10:30:00")
        LocalDateTime createdAt,

        @Schema(description = "Indicates if the authenticated user upvoted this.", example = "false")
        boolean votedByMe,

        @Schema(description = "Indicates if the tool has been approved.", example = "true")
        boolean isApproved,

        @Schema(description = "Total number of upvotes.", example = "42")
        int upvotesCount,

        @Schema(description = "Email of the user who suggested the tool.")
        String userEmail,

        @Schema(description = "List of tags this tool belongs to.")
        List<TagResponseDTO> tags
) {
}