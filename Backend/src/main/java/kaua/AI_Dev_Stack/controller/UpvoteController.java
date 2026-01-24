package kaua.AI_Dev_Stack.controller;

import kaua.AI_Dev_Stack.service.UpvoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/upvotes")
public class UpvoteController {

    private final UpvoteService upvoteService;

    public UpvoteController(UpvoteService upvoteService) {
        this.upvoteService = upvoteService;
    }

    @PostMapping("/resource/{resourceId}")
    public ResponseEntity<Void> toggleUpvote(
            @PathVariable UUID resourceId,
            @RequestParam UUID userId) {

        upvoteService.toggleUpvote(userId, resourceId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{resourceId}")
    public ResponseEntity<Long> getCount(@PathVariable UUID resourceId) {
        return ResponseEntity.ok(upvoteService.getCount(resourceId));
    }
}
