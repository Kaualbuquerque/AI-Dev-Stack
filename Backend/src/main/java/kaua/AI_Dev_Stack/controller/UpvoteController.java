package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kaua.AI_Dev_Stack.service.UpvoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/upvotes")
@Tag(
        name = "upvoutes",
        description = "Engagement and popularity management. Allows users to boost AI tools, directly influencing their ranking and visibility within the directory")
public class UpvoteController {

    private final UpvoteService upvoteService;

    public UpvoteController(UpvoteService upvoteService) {
        this.upvoteService = upvoteService;
    }

    @PostMapping("/resource/{resourceId}")
    @Operation(
            summary = "Toggle upvote",
            description = "Handles the upvote logic in a single action. If the user hasn't voted for this resource yet, an upvote is added. If they have already voted, the upvote is removed."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Upvote toggled successfully (state changed)"),
            @ApiResponse(responseCode = "400", description = "Invalid UUID format for resource or user"),
            @ApiResponse(responseCode = "404", description = "Resource not found with the provided ID"),
            @ApiResponse(responseCode = "500", description = "Internal server error during the toggle operation")
    })
    public ResponseEntity<Void> toggleUpvote(
            @PathVariable UUID resourceId,
            @RequestParam UUID userId) {

        upvoteService.toggleUpvote(userId, resourceId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{resourceId}")
    @Operation(
            summary = "Get upvote count",
            description = "Retrieves the total number of upvotes for a specific AI resource."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Resource not found with the provided ID"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Long> getCount(@PathVariable UUID resourceId) {
        return ResponseEntity.ok(upvoteService.getCount(resourceId));
    }
}
