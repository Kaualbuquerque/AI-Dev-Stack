package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.ResourceRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ResourceResponseDTO;
import kaua.AI_Dev_Stack.mapper.ResourceMapper;
import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resources")
@Tag(
        name = "Resources",
        description = "Endpoints for managing AI-powered tools")
public class ResourceController {
    private final ResourceService resourceService;
    private final ResourceMapper resourceMapper;

    public ResourceController(ResourceService resourceService, ResourceMapper resourceMapper) {
        this.resourceService = resourceService;
        this.resourceMapper = resourceMapper;
    }

    @PostMapping
    @Operation(
            summary = "Submit a new resource",
            description = "Registers a new AI resource in the directory"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "AI Resource registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid data"),
            @ApiResponse(responseCode = "409", description = "This AI tool URL is already registered"),
    })
    public ResponseEntity<ResourceResponseDTO> save(@Valid @RequestBody ResourceRequestDTO body) {
        Resource resource = resourceService.save(body);

        ResourceResponseDTO response = resourceMapper.toResponseDTO(resource);

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
    public ResponseEntity<Page<Resource>> findAll(Pageable pageable) {
        return ResponseEntity.ok(resourceService.findAllApproved(pageable));
    }

    // @GetMapping("/{slug}")
    // public ResponseEntity<Page<Resource>> findBySlug(@PathVariable String slug){
    //     return ResponseEntity.();
    // }
}
