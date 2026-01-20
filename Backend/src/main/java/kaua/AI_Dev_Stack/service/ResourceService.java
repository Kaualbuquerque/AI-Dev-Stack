package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.repository.CategoryRepository;
import kaua.AI_Dev_Stack.repository.ResourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final CategoryRepository categoryRepository;

    public ResourceService(ResourceRepository resourceRepository, CategoryRepository categoryRepository) {
        this.resourceRepository = resourceRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Resource save(Resource resource) {
        // 1. Gerar o Slug a partir do título
        String slug = generateSlug(resource.getTitle());
        resource.setSlug(slug);

        // 2. Validar se o Slug já existe (Regra de Negócio)
        if (resourceRepository.findBySlugIgnoreCase(slug).isPresent()) {
            throw new RuntimeException("There is already a resource with a similar title (Duplicate Slug).");
        }

        // 3. Validar se a categoria associada existe
        if (resource.getCategory() != null && resource.getCategory().getId() != null) {
            categoryRepository.findById(resource.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("The category provided does not exist."));
        }

        return resourceRepository.save(resource);
    }

    @Transactional(readOnly = true)
    public Page<Resource> findAllApproved(Pageable pageable) {
        return resourceRepository.findByIsApprovedTrue(pageable);
    }

    private String generateSlug(String title) {
        if (title == null) return "";

        // 1. Transforma em minúsculo
        String base = title.toLowerCase().trim();

        // 2. Normaliza (Separa o caractere do acento, ex: 'á' vira 'a' + '´')
        String normalize = Normalizer.normalize(base, Normalizer.Form.NFD);

        // 3. Usa Regex para remover os acentos (combining marks)
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String wihtoutAccents = pattern.matcher(normalize).replaceAll("");

        // 4. Remove qualquer coisa que não seja letra, número ou espaço, e troca espaços por hífens
        return wihtoutAccents
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-"); // Evita múltiplos hífens seguidos
    }
}
