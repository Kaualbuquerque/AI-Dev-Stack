package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.exceptions.ResourceNotFoundException;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.Upvote;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UpvoteService {
    private final UpvoteRepository upvoteRepository;
    private final ToolRepository toolRepository;

    public UpvoteService(UpvoteRepository upvoteRepository, ToolRepository toolRepository) {
        this.upvoteRepository = upvoteRepository;
        this.toolRepository = toolRepository;
    }

    @Transactional
    public void toggleUpvote(User user, UUID toolId) {
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new ResourceNotFoundException("Tool not found"));

        if (upvoteRepository.existsByUserIdAndToolId(user.getId(), toolId)) {
            upvoteRepository.deleteByUserIdAndToolId(user.getId(), toolId);
            tool.setUpvotesCount(Math.max(0, tool.getUpvotesCount() - 1));
        } else {
            Upvote newUpvote = new Upvote();
            newUpvote.setUser(user);
            newUpvote.setTool(tool);
            upvoteRepository.save(newUpvote);
            tool.setUpvotesCount(tool.getUpvotesCount() + 1);
        }
        toolRepository.save(tool);
    }
}
