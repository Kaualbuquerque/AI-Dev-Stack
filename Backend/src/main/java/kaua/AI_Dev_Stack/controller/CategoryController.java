package kaua.AI_Dev_Stack.controller;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryService categoryService, CategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> save(@Valid @RequestBody CategoryRequestDTO body) {
        Category category = categoryService.save(body);

        CategoryResponseDTO response = categoryMapper.toResponseDTO(category);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> findAll(){
        List<Category> categorys = categoryService.findAll();

        List<CategoryResponseDTO> response = categorys.stream()
                .map(categoryMapper::toResponseDTO)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryResponseDTO> findBySlug(@PathVariable String slug) {
        Category category = categoryService.findBySlug(slug);

        CategoryResponseDTO response = categoryMapper.toResponseDTO(category);

        return ResponseEntity.ok(response);
    }
}
