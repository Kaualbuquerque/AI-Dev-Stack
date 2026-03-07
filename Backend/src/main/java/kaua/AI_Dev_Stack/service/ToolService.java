package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.mapper.ToolMapper;
import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.repository.CategoryRepository;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ToolService {

    private final ToolRepository toolRepository;
    private final CategoryRepository categoryRepository;
    private final ToolMapper toolMapper;

    public ToolService(ToolRepository toolRepository, CategoryRepository categoryRepository, ToolMapper toolMapper) {
        this.toolRepository = toolRepository;
        this.categoryRepository = categoryRepository;
        this.toolMapper = toolMapper;
    }

    @Transactional
    public ToolResponseDTO save(ToolRequestDTO dto) {
        // 1. Busca as categorias no banco pelos IDs do DTO
        List<Category> categories = categoryRepository.findAllById(dto.categoryIds());

        if (categories.isEmpty()) {
            throw new RuntimeException("Nenhuma categoria encontrada para os IDs fornecidos.");
        }

        // 2. Chama o mapper passando o DTO e a lista de categorias resolvida
        Tool tool = toolMapper.toEntity(dto, categories);

        // 4. Salva a entidade
        Tool savedTool = toolRepository.save(tool);

        // 5. Retorna o ResponseDTO (votedByMe false por padrão para novos cadastros)
        return toolMapper.toResponseDTO(savedTool, null);
    }

    @Transactional(readOnly = true)
    public Page<Tool> findAllApproved(Pageable pageable) {
        return toolRepository.findByIsApprovedTrue(pageable);
    }
}
