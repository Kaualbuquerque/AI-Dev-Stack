package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.TagRequestDTO;
import kaua.AI_Dev_Stack.dto.response.TagResponseDTO;
import kaua.AI_Dev_Stack.mapper.TagMapper;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tags")
@io.swagger.v3.oas.annotations.tags.Tag(
        name = "Tags",
        description = "Technology specialization labels. They allow for the precise identification of each AI's capabilities")
public class TagController {

    private final TagService tagService;
    private final TagMapper tagMapper;

    public TagController(TagService tagService, TagMapper tagMapper) {
        this.tagService = tagService;
        this.tagMapper = tagMapper;
    }

    @PostMapping
    @Operation(
            summary = "Ensure tag existence",
            description = "Checks if a tag exists by name and returns it. If it doesn't exist, a new one is automatically created")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tag successfully retrieved or created"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    public ResponseEntity<TagResponseDTO> findOrCreate(@Valid @RequestBody TagRequestDTO body) {
        Tag tag = tagService.findOrCreate(body.name());
        Long actualCount = tagService.getUsageCount(tag.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(tagMapper.toResponseDTO(tag, actualCount));
    }

    @GetMapping
    @Operation(
            summary = "List all tags with usage stats",
            description = "Retrieves a complete list of tags available, including the total count of AI resources associated with each tag.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tags successfully retrieved"),
            @ApiResponse(responseCode = "500", description = "Internal server error while fetching tags")
    })
    public ResponseEntity<List<TagResponseDTO>> findAll() {
        List<TagResponseDTO> response = tagService.findAllWithCount().stream()
                .map(projection -> new TagResponseDTO(
                        projection.getId(),
                        projection.getName(),
                        projection.getUsageCount()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Find tag by ID",
            description = "Retrieves a single tag's details and its total usage frequency based on its unique UUID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag found successfully"),
            @ApiResponse(responseCode = "404", description = "Tag not found with the provided ID"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<TagResponseDTO> findById(@PathVariable UUID id) {
        Tag tag = tagService.findById(id);
        Long actualCount = tagService.getUsageCount(id);

        return ResponseEntity.ok(tagMapper.toResponseDTO(tag, actualCount));
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete a tag",
            description = "Permanently removes a tag from the system. This action might fail if the tag is currently associated with AI resources."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tag deleted successfully (No content)"),
            @ApiResponse(responseCode = "404", description = "Tag not found with the provided ID"),
            @ApiResponse(responseCode = "409", description = "Conflict: Tag cannot be deleted because it is being used by resources"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
