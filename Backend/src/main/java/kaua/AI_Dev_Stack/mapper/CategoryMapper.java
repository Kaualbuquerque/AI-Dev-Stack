package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.CategoryRequestDTO;
import kaua.AI_Dev_Stack.dto.response.CategoryResponseDTO;
import kaua.AI_Dev_Stack.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequestDTO dto){
        if (dto == null) return null;

        Category category = new Category();
        category.setName(dto.name().toLowerCase().trim());
        category.setIconKey(dto.iconKey());

        return category;
    }

    public CategoryResponseDTO toResponseDTO(Category category){
        if (category == null) return null;

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getIconKey()
        );
    }
}
