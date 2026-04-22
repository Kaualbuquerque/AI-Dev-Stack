package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.FiltersResponseDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.exceptions.ResourceNotFoundException;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.StackType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.service.ToolService;
import kaua.AI_Dev_Stack.service.UpvoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<Page<ToolResponseDTO>> findAll(
            Pageable pageable,
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String pricing,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) List<String> stack,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Boolean votedByMe) {
        return ResponseEntity.ok(toolService.findAllApproved(pageable, user, search, pricing, type, stack, tag, votedByMe));
    }

    @GetMapping("/search")
    @Operation(summary = "Find tool by name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tool found successfully"),
            @ApiResponse(responseCode = "404", description = "Tool not found with the provided name"),
            @ApiResponse(responseCode = "400", description = "Missing or invalid name parameter"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ToolResponseDTO> findByName(
            @RequestParam String name,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(toolService.findByName(name, user));
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
        upvoteService.toggleUpvote(user, toolId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/filters")
    @Operation(
            summary = "Get available filters",
            description = "Returns all available filter options for pricing, tool type and stack"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Filters retrieved successfully")
    })
    public ResponseEntity<FiltersResponseDTO> getFilters() {
        return ResponseEntity.ok(new FiltersResponseDTO(
                PricingType.values(),
                ToolType.values(),
                StackType.values()
        ));
    }

    @PatchMapping("/{toolId}/approve")
    @Operation(
            summary = "Approve tool",
            description = "Approves a tool suggestion — requires ADMIN role"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tool approved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden — requires ADMIN role"),
            @ApiResponse(responseCode = "404", description = "Tool not found")
    })
    public ResponseEntity<ToolResponseDTO> approve(@PathVariable UUID toolId) {
        return ResponseEntity.ok(toolService.approve(toolId));
    }

    @DeleteMapping("/{toolId}")
    @Operation(
            summary = "Delete tool",
            description = "Permanently deletes a tool — requires ADMIN role"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tool deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden — requires ADMIN role"),
            @ApiResponse(responseCode = "404", description = "Tool not found")
    })
    public ResponseEntity<Void> delete(@PathVariable UUID toolId) {
        toolService.delete(toolId);
        return ResponseEntity.noContent().build();
    }
}
