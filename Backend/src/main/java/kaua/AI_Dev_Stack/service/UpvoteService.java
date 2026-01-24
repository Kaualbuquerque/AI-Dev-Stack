package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.model.Upvote;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.ResourceRepository;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import kaua.AI_Dev_Stack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UpvoteService {
    private final UpvoteRepository upvoteRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public UpvoteService(UpvoteRepository upvoteRepository, UserRepository userRepository, ResourceRepository resourceRepository) {
        this.upvoteRepository = upvoteRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public void toggleUpvote(UUID userId, UUID resourceId) {
        // 1. Busca as entidades (ou lança erro 404)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        // 2. Lógica do Toggle
        if (upvoteRepository.existsByUserIdAndResourceId(userId, resourceId)) {
            upvoteRepository.deleteByUserIdAndResourceId(userId, resourceId);
        } else {
            Upvote newUpvote = new Upvote();
            newUpvote.setUser(user);
            newUpvote.setResource(resource);
            upvoteRepository.save(newUpvote);
        }
    }

    @Transactional(readOnly = true)
    public long getCount(UUID resourceId) {
        return upvoteRepository.countByResourceId(resourceId);
    }

    //será usado dentro da listagem de Resources
    @Transactional(readOnly = true)
    public boolean hasVoted(UUID userId, UUID resourceId) {
        if (userId == null || resourceId == null) return false;
        return upvoteRepository.existsByUserIdAndResourceId(userId, resourceId);
    }

}
