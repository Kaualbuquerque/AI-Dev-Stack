package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    // Injeção de dependência via Construtor
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Category save(Category category) {
        // Regra de Negócio: Não permitir nomes duplicados (Case Insensitive)
        categoryRepository.findByNameIgnoreCase(category.getName()).ifPresent(existing -> {
            throw new RuntimeException("Category already registered: " + category.getName());
        });

        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public  Category findById(UUID id){
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
}
