package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.TagRequestDTO;
import kaua.AI_Dev_Stack.dto.response.TagResponseDTO;
import kaua.AI_Dev_Stack.model.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    public Tag toEntity(TagRequestDTO dto) {
        if (dto == null) return null;

        Tag tag = new Tag();
        tag.setName(dto.name().trim().toLowerCase());

        return tag;
    }

    public TagResponseDTO toResponseDTO(Tag tag, Long usageCount) {
        if (tag == null) return null;

        return new TagResponseDTO(
                tag.getId(),
                tag.getName(),
                usageCount != null ? usageCount : 0L
        );
    }
}
