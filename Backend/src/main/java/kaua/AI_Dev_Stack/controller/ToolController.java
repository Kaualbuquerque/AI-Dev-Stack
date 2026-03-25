package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.service.ToolService;
import kaua.AI_Dev_Stack.service.UpvoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/tools")
@Tag(name = "Tools", description = "Endpoints for managing AI-powered tools")
public class ToolController {

    private final ToolService toolService;
    private final UpvoteService upvoteService;

    public ToolController(ToolService toolService, UpvoteService upvoteService) {
        this.toolService = toolService;
        this.upvoteService = upvoteService;
    }

    @PostMapping
    @Operation(
            summary = "Submit a new tool suggestion",
            description = "Registers a new AI tool suggestion — requires authentication"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "AI Tool registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            @ApiResponse(responseCode = "409", description = "This AI tool URL is already registered"),
    })
    public ResponseEntity<ToolResponseDTO> save(@Valid @RequestBody ToolRequestDTO body, @AuthenticationPrincipal User user) {
        ToolResponseDTO response = toolService.save(body, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
            summary = "List and discover AI tools",
            description = "Retrieves a paginated list of all approved AI tools with upvote info"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tools list retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "System failed to fetch tools list")
    })
    public ResponseEntity<Page<ToolResponseDTO>> findAll(Pageable pageable, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(toolService.findAllApproved(pageable, user));
    }

    @PostMapping("/{toolId}/upvote")
    @Operation(
            summary = "Toggle upvote",
            description = "Adds or removes an upvote for a tool — requires authentication"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Upvote toggled successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            @ApiResponse(responseCode = "404", description = "Tool not found")
    })
    public ResponseEntity<Void> toggleUpvote(@PathVariable UUID toolId, @AuthenticationPrincipal User user) {
        upvoteService.toggleUpvote(user.getId(), toolId);
        return ResponseEntity.ok().build();
    }
}
