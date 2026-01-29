package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.CategoryRequestDTO;
import kaua.AI_Dev_Stack.dto.response.CategoryResponseDTO;
import kaua.AI_Dev_Stack.mapper.CategoryMapper;
import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@Tag(
        name = "Categories",
        description = "Thematic organization of AI resources. Allows grouping tools by area of expertise, such as Design, NLP, or Development")
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryService categoryService, CategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    @PostMapping
    @Operation(
            summary = "Create category",
            description = "Creates a new category with a unique slug")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Category created"),
            @ApiResponse(responseCode = "400", description = "Invalid data"),
            @ApiResponse(responseCode = "409", description = "Existing category")
    })
    public ResponseEntity<CategoryResponseDTO> save(@Valid @RequestBody CategoryRequestDTO body) {
        Category category = categoryService.save(body);

        CategoryResponseDTO response = categoryMapper.toResponseDTO(category);

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
    public ResponseEntity<List<CategoryResponseDTO>> findAll() {
        List<Category> categories = categoryService.findAll();

        List<CategoryResponseDTO> response = categories.stream()
                .map(categoryMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    @Operation(
            summary = "Find category by slug",
            description = "Retrieves the details of a specific category using its unique URL-friendly slug"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category successfully retrieved"),
            @ApiResponse(responseCode = "404", description = "Category not found with the provided slug"),
            @ApiResponse(responseCode = "500", description = "Internal server error while fetching categories")
    })
    public ResponseEntity<CategoryResponseDTO> findBySlug(@PathVariable String slug) {
        Category category = categoryService.findBySlug(slug);

        CategoryResponseDTO response = categoryMapper.toResponseDTO(category);

        return ResponseEntity.ok(response);
    }
}
