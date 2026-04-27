package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.exceptions.DuplicateResourceException;
import kaua.AI_Dev_Stack.exceptions.ResourceNotFoundException;
import kaua.AI_Dev_Stack.mapper.ToolMapper;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.TagRepository;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import kaua.AI_Dev_Stack.repository.ToolSpecification;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
        try {
            List<Tag> tags = tagRepository.findAllById(dto.tagIds());

            if (toolRepository.existsByUrl(dto.url())){
                throw new DuplicateResourceException("A tool with this URL is already registered.");
            }

            if (tags.isEmpty()) {
                throw new ResourceNotFoundException("No tags found for the provided IDs.");
            }

            if (tags.size() > 5) {
                throw new RuntimeException("Maximum of 5 tags allowed.");
            }

            Tool tool = toolMapper.toEntity(dto, tags, currentUser);
            Tool savedTool = toolRepository.save(tool);
            return toolMapper.toResponseDTO(savedTool, false);

        } catch (Exception e) {
            // ✅ Loga o erro completo
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public ToolResponseDTO findByName(String name, User currentUser) {
        Tool tool = toolRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Tool not found"));

        boolean votedByMe = currentUser != null &&
                upvoteRepository.existsByUserIdAndToolId(currentUser.getId(), tool.getId());

        return toolMapper.toResponseDTO(tool, votedByMe);
    }

    @Transactional(readOnly = true)
    public Page<ToolResponseDTO> findAllApproved(
            Pageable pageable,
            User currentUser,
            String search,
            String pricing,
            String type,
            List<String> stack,
            String tag,
            Boolean votedByMe) {

        Specification<Tool> spec = ToolSpecification.withFilters(search, pricing, type, stack, tag, votedByMe, currentUser);
        Page<Tool> tools = toolRepository.findAll(spec, pageable);

        Set<UUID> votedToolIds = currentUser != null
                ? upvoteRepository.findToolIdsByUserId(currentUser.getId())
                : Set.of();

        return tools.map(tool -> toolMapper.toResponseDTO(
                tool,
                votedToolIds.contains(tool.getId())
        ));
    }

    @Transactional
    public ToolResponseDTO approve(UUID toolId) {
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new ResourceNotFoundException("Tool not found."));

        tool.setApproved(true);
        Tool savedTool = toolRepository.save(tool);

        return toolMapper.toResponseDTO(savedTool, false);
    }

    @Transactional
    public void delete(UUID toolId) {
        if (!toolRepository.existsById(toolId)) {
            throw new ResourceNotFoundException("Tool not found");
        }
        toolRepository.deleteById(toolId);
    }
}
