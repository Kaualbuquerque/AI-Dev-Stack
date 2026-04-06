package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.TagResponseDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ToolMapper {

    // Converte de DTO de entrada para Entidade
    public Tool toEntity(ToolRequestDTO dto, List<Tag> tags, User user) {
        if (dto == null) return null;

        Tool tool = new Tool();
        tool.setName(dto.name().trim());
        tool.setDescription(dto.description());
        tool.setUrl(dto.url());
        tool.setThumbnailUrl(dto.thumbnailUrl());
        tool.setPricingModel(dto.pricingModel());
        tool.setToolType(dto.toolType());
        tool.setFeatured(false);
        tool.setStacks(new ArrayList<>(dto.stacks()));
        tool.setTags(new ArrayList<>(tags));
        tool.setUser(user);

        return tool;
    }

    // Converte de Entidade para DTO de saída (Response)
    public ToolResponseDTO toResponseDTO(Tool tool, int upvotesCount, boolean votedByMe) {
        if (tool == null) return null;

        // Mapeia tags para TagResponseDTO
        List<TagResponseDTO> tagDTOs = tool.getTags() != null
                ? tool.getTags().stream()
                .map(tag -> new TagResponseDTO(tag.getName(), tag.getSlug(), tag.getIconKey()))
                .toList()
                : List.of();

        return new ToolResponseDTO(
                tool.getId(),
                tool.getName(),
                tool.getDescription(),
                tool.getUrl(),
                tool.getThumbnailUrl(),
                tool.getPricingModel(),
                tool.getToolType(),
                tool.getStacks(),
                tool.isFeatured(),
                tool.getCreatedAt(),
                votedByMe,
                upvotesCount,
                tool.getUser().getEmail(),
                tagDTOs
        );
    }
}
