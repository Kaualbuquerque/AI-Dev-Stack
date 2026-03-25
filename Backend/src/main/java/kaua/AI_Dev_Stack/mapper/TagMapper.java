package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.TagRequestDTO;
import kaua.AI_Dev_Stack.dto.response.TagResponseDTO;
import kaua.AI_Dev_Stack.model.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    public Tag toEntity(TagRequestDTO dto){
        if (dto == null) return null;

        Tag tag = new Tag();
        tag.setName(dto.name().toLowerCase().trim());
        tag.setIconKey(dto.iconKey());

        return tag;
    }

    public TagResponseDTO toResponseDTO(Tag tag){
        if (tag == null) return null;

        return new TagResponseDTO(
                tag.getName(),
                tag.getSlug(),
                tag.getIconKey()
        );
    }
}
