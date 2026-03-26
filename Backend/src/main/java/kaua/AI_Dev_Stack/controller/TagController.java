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

@RestController
@RequestMapping("/tags")
@io.swagger.v3.oas.annotations.tags.Tag(
        name = "Tags",
        description = "Thematic tags for AI tools. Allows grouping tools by area of expertise, such as Design, NLP, or Development")
public class TagController {
    private final TagService tagService;
    private final TagMapper tagMapper;

    public TagController(TagService tagService, TagMapper tagMapper) {
        this.tagService = tagService;
        this.tagMapper = tagMapper;
    }

    @PostMapping
    @Operation(
            summary = "Create category",
            description = "Creates a new tag — requires ADMIN role")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tag created"),
            @ApiResponse(responseCode = "400", description = "Invalid data"),
            @ApiResponse(responseCode = "409", description = "Existing category")
    })
    public ResponseEntity<TagResponseDTO> save(@Valid @RequestBody TagRequestDTO body) {
        Tag tag = tagService.save(body);

        TagResponseDTO response = tagMapper.toResponseDTO(tag);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
            summary = "List all categories",
            description = "Retrieves a complete list of all categories available in the system")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categories successfully retrieved"),
            @ApiResponse(responseCode = "500", description = "Internal server error while fetching categories")
    })
    public ResponseEntity<List<TagResponseDTO>> findAll() {
        List<Tag> categories = tagService.findAll();

        List<TagResponseDTO> response = categories.stream()
                .map(tagMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    @Operation(
            summary = "Find category by slug",
            description = "Retrieves the details of a specific category using its unique URL-friendly slug"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag successfully retrieved"),
            @ApiResponse(responseCode = "404", description = "Tag not found with the provided slug"),
            @ApiResponse(responseCode = "500", description = "Internal server error while fetching categories")
    })
    public ResponseEntity<TagResponseDTO> findBySlug(@PathVariable String slug) {
        Tag tag = tagService.findBySlug(slug);

        TagResponseDTO response = tagMapper.toResponseDTO(tag);

        return ResponseEntity.ok(response);
    }
}
