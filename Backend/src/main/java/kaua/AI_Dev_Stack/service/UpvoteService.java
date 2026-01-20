package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.model.Upvote;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UpvoteService {
    private final UpvoteRepository upvoteRepository;

    public UpvoteService(UpvoteRepository upvoteRepository) {
        this.upvoteRepository = upvoteRepository;
    }

    @Transactional
    public void toggleUpvote(User user, Resource resource) {
        UUID userId = user.getId();
        UUID resourceId = resource.getId();

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
    public long getCount(UUID resourceId){
        return upvoteRepository.countByResourceId(resourceId);
    }

    @Transactional(readOnly = true)
    public boolean hasVoted(User user, Resource resource){
        UUID userId = user.getId();
        UUID resourceId = resource.getId();

        return upvoteRepository.existsByUserIdAndResourceId(userId, resourceId);
    }

}
