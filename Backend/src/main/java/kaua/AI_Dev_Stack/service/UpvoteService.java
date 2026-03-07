package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.Upvote;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import kaua.AI_Dev_Stack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UpvoteService {
    private final UpvoteRepository upvoteRepository;
    private final UserRepository userRepository;
    private final ToolRepository toolRepository;

    public UpvoteService(UpvoteRepository upvoteRepository, UserRepository userRepository, ToolRepository toolRepository) {
        this.upvoteRepository = upvoteRepository;
        this.userRepository = userRepository;
        this.toolRepository = toolRepository;
    }

    @Transactional
    public void toggleUpvote(UUID userId, UUID toolId) {
        // 1. Busca as entidades (ou lança erro 404)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Tool not found"));

        // 2. Lógica do Toggle
        if (upvoteRepository.existsByUserIdAndToolId(userId, toolId)) {
            upvoteRepository.deleteByUserIdAndToolId(userId, toolId);
        } else {
            Upvote newUpvote = new Upvote();
            newUpvote.setUser(user);
            newUpvote.setTool(tool);
            upvoteRepository.save(newUpvote);
        }
    }

    @Transactional(readOnly = true)
    public long getCount(UUID toolId) {
        return upvoteRepository.countByToolId(toolId);
    }

    //será usado dentro da listagem de Tools
    @Transactional(readOnly = true)
    public boolean hasVoted(UUID userId, UUID toolId) {
        if (userId == null || toolId == null) return false;
        return upvoteRepository.existsByUserIdAndToolId(userId, toolId);
    }

}
