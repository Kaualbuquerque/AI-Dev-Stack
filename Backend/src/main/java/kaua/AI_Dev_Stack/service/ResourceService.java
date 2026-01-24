package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.ResourceRequestDTO;
import kaua.AI_Dev_Stack.mapper.ResourceMapper;
import kaua.AI_Dev_Stack.model.Category;
import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.repository.CategoryRepository;
import kaua.AI_Dev_Stack.repository.ResourceRepository;
import kaua.AI_Dev_Stack.utils.SlugUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;
    private final ResourceMapper resourceMapper;

    public ResourceService(ResourceRepository resourceRepository, CategoryRepository categoryRepository, TagService tagService, ResourceMapper resourceMapper) {
        this.resourceRepository = resourceRepository;
        this.categoryRepository = categoryRepository;
        this.tagService = tagService;
        this.resourceMapper = resourceMapper;
    }

    @Transactional
    public Resource save(ResourceRequestDTO dto) {
        // 1. Buscar a Categoria (Não existe IA sem categoria)
        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + dto.categoryId()));

        Set<Tag> managedTags = (dto.tags() == null) ? Set.of() :
                dto.tags().stream()
                        .map(tagService::findOrCreate)
                        .collect(Collectors.toSet());

        // 2. Entrega tudo pronto para o Mapper converter
        Resource resource = resourceMapper.toEntity(dto, category, managedTags);

        String slug = SlugUtils.generateSlug(dto.title());
        resource.setSlug(slug);

        return resourceRepository.save(resource);
    }

    @Transactional(readOnly = true)
    public Page<Resource> findAllApproved(Pageable pageable) {
        return resourceRepository.findByIsApprovedTrue(pageable);
    }
}
