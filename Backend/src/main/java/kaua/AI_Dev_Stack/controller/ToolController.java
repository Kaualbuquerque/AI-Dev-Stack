package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ToolResponseDTO;
import kaua.AI_Dev_Stack.mapper.ToolMapper;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.service.ToolService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tools")
@Tag(
        name = "Tools",
        description = "Endpoints for managing AI-powered tools")
public class ToolController {
    private final ToolService toolService;
    private final ToolMapper toolMapper;

    public ToolController(ToolService toolService, ToolMapper toolMapper) {
        this.toolService = toolService;
        this.toolMapper = toolMapper;
    }

    @PostMapping
    @Operation(
            summary = "Submit a new resource",
            description = "Registers a new AI resource in the directory"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "AI Tool registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data"),
            @ApiResponse(responseCode = "409", description = "This AI tool URL is already registered"),
    })
    public ResponseEntity<ToolResponseDTO> save(@Valid @RequestBody ToolRequestDTO body, @AuthenticationPrincipal User user) {
        // O service já faz o trabalho de salvar e converter para DTO
        ToolResponseDTO response = toolService.save(body);

        // Retornamos diretamente o response que veio do service
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
            summary = "List and discover AI tools",
            description = "Retrieves a paginated list of all verified AI tools available for developers."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tools list retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "System failed to fetch tools list")
    })
    public ResponseEntity<Page<Tool>> findAll(Pageable pageable) {
        return ResponseEntity.ok(toolService.findAllApproved(pageable));
    }

    // @GetMapping("/{slug}")
    // public ResponseEntity<Page<Tool>> findBySlug(@PathVariable String slug){
    //     return ResponseEntity.();
    // }
}
