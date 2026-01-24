package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.ResourceRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ResourceResponseDTO;
import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.model.Tag;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ResourceMapper {

    // Converte de DTO de entrada para Entidade
    public Resource toEntity(ResourceRequestDTO dto, Category category, Set<Tag> tags) {
        if (dto == null) return null;

        Resource resource = new Resource();
        resource.setTitle(dto.title().trim());
        resource.setDescription(dto.description());
        resource.setLongDescription(dto.longDescription());
        resource.setUrl(dto.url());
        resource.setThumbnailUrl(dto.thumbnailUrl());
        resource.setPricingModel(dto.pricingModel());

        // Relacionamentos já processados pelo Service
        resource.setCategory(category);
        resource.setTags(tags);

        return resource;
    }

    // Converte de Entidade para DTO de saída (Response)
    public ResourceResponseDTO toResponseDTO(Resource resource) {
        if (resource == null) return null;

        // Extrai os nomes das tags para não enviar o objeto Tag inteiro
        Set<String> tagNames = resource.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        return new ResourceResponseDTO(
                resource.getId(),
                resource.getTitle(),
                resource.getSlug(),
                resource.getDescription(),
                resource.getUrl(),
                resource.getThumbnailUrl(),
                resource.getPricingModel(),
                resource.getCategory().getName(), // Só o nome da categoria
                tagNames
        );
    }
}
