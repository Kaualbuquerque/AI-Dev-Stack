package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.CategoryRequestDTO;
import kaua.AI_Dev_Stack.mapper.CategoryMapper;
import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.repository.CategoryRepository;
import kaua.AI_Dev_Stack.utils.SlugUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    // Injeção de dependência via Construtor
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Transactional
    public Category save(CategoryRequestDTO dto) {
        if (categoryRepository.existsByName(dto.name())) {
            throw new RuntimeException("Category with name " + dto.name() + " already exists.");
        }

        Category category = categoryMapper.toEntity(dto);
        category.setSlug(SlugUtils.generateSlug(dto.name()));


        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public Category findById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional(readOnly = true)
    public Category findBySlug(String slug) {
        return categoryRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
}
