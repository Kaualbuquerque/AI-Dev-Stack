package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.mapper.ToolMapper;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.TagRepository;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ToolService {

    private final ToolRepository toolRepository;
    private final TagRepository tagRepository;
    private final ToolMapper toolMapper;
    private final UpvoteRepository upvoteRepository;

    public ToolService(ToolRepository toolRepository, TagRepository tagRepository,
                       ToolMapper toolMapper, UpvoteRepository upvoteRepository) {
        this.toolRepository = toolRepository;
        this.tagRepository = tagRepository;
        this.toolMapper = toolMapper;
        this.upvoteRepository = upvoteRepository;
    }

    @Transactional
    public ToolResponseDTO save(ToolRequestDTO dto, User currentUser) {
        // Busca as tags no banco pelos IDs
        List<Tag> tags = tagRepository.findAllById(dto.tagIds());

        if (tags.isEmpty()) {
            throw new RuntimeException("No tags found for the provided IDs.");
        }

        // Valida o limite de 5 tags
        if (tags.size() > 5) {
            throw new RuntimeException("Maximum of 5 tags allowed.");
        }

        // Monta a entidade com tags e usuário autenticado
        Tool tool = toolMapper.toEntity(dto, tags, currentUser);

        // Salva
        Tool savedTool = toolRepository.save(tool);

        // Retorna o DTO - votedByMe false e upvotesCount 0 para nova ferramenta
        return toolMapper.toResponseDTO(savedTool, 0, false);
    }

    @Transactional(readOnly = true)
    public Page<ToolResponseDTO> findAllApproved(Pageable pageable, User currentUser) {
        // Busca as tools paginadas
        Page<Tool> tools = toolRepository.findByIsApprovedTrue(pageable);

        // Busca os IDs das tools que o usuário votou - uma única query
        Set<UUID> votedToolIds = currentUser != null
                ? upvoteRepository.findToolIdsByUserId(currentUser.getId())
                : Set.of();

        // Mapeia cada tool para DTO calculando upvotesCount e votedByMe
        return tools.map(tool -> toolMapper.toResponseDTO(
                tool,
                tool.getUpvotes().size(),
                votedToolIds.contains(tool.getId())
        ));
    }
}
