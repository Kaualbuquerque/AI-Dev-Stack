package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.CategoryResponseDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ToolMapper {

    // Converte de DTO de entrada para Entidade
    public Tool toEntity(ToolRequestDTO dto, List<Category> categories) {
        if (dto == null) return null;

        Tool tool = new Tool();

        // Mapeamento de campos básicos
        // Usei .title() assumindo que seu RequestDTO usa o padrão 'title' do front
        tool.setName(dto.name() != null ? dto.name().trim() : null);
        tool.setDescription(dto.description());
        tool.setUrl(dto.url());
        tool.setThumbnailUrl(dto.thumbnailUrl());
        tool.setPricingModel(dto.pricingModel());

        // Novos campos
        tool.setToolType(dto.toolType());
        tool.setFeatured(dto.featured());

        // Associa a lista de categorias encontradas no banco
        if (categories != null) {
            tool.setCategories(new ArrayList<>(categories));
        }

        return tool;
    }

    // Converte de Entidade para DTO de saída (Response)
    public ToolResponseDTO toResponseDTO(Tool tool, User currentUser) {
        if (tool == null) return null;

        // 1. Lógica do votedByMe
        boolean votedByMe = false;
        if (currentUser != null && tool.getUpvotes() != null) {
            votedByMe = tool.getUpvotes().stream()
                    .anyMatch(upvote -> upvote.getUser().getId().equals(currentUser.getId()));
        }

        // 2. Mapeamento da lista de Categorias (Entidade -> DTO resumido)
        List<CategoryResponseDTO> categoryDTOs = tool.getCategories().stream()
                .map(cat -> new CategoryResponseDTO(cat.getName(), cat.getSlug(), cat.getIconKey()))
                .toList();

        // 3. Construção do Record (respeitando a ordem e nomes do seu DTO atualizado)
        return new ToolResponseDTO(               // ID (UUID)
                tool.getName(),                  // Título/Nome
                tool.getDescription(),
                tool.getUrl(),
                tool.getThumbnailUrl(),
                tool.getPricingModel(),
                tool.getToolType().getLabel(), // Converte Enum para String amigável
                tool.isFeatured(),
                votedByMe,
                tool.getUpvotes() != null ? tool.getUpvotes().size() : 0, // Evita NullPointer
                categoryDTOs                     // A nova lista de categorias
        );
    }
}
