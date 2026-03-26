package kaua.AI_Dev_Stack.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.StackType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;

@Schema(description = "Available filter options for the tools directory.")
public record FiltersResponseDTO(

        @Schema(description = "Available pricing models.", example = "[\"Free\", \"Freemium\", \"Paid\"]")
        PricingType[] pricingModels,

        @Schema(description = "Available tool types.", example = "[\"web\", \"cli\", \"vscode\"]")
        ToolType[] toolTypes,

        @Schema(description = "Available technology stacks.", example = "[\"JAVA\", \"PYTHON\"]")
        StackType[] stacks
) {
}
