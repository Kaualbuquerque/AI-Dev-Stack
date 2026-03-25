package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.TagRequestDTO;
import kaua.AI_Dev_Stack.mapper.TagMapper;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.repository.TagRepository;
import kaua.AI_Dev_Stack.utils.SlugUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TagService {

    // Injeção de dependência via Construtor
    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    public TagService(TagRepository tagRepository, TagMapper tagMapper) {
        this.tagRepository = tagRepository;
        this.tagMapper = tagMapper;
    }

    @Transactional
    public Tag save(TagRequestDTO dto) {
        if (tagRepository.existsByName(dto.name())) {
            throw new RuntimeException("Tag with name " + dto.name() + " already exists.");
        }

        Tag tag = tagMapper.toEntity(dto);
        tag.setSlug(SlugUtils.generateSlug(dto.name()));


        return tagRepository.save(tag);
    }

    @Transactional(readOnly = true)
    public Tag findById(UUID id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    @Transactional(readOnly = true)
    public Tag findBySlug(String slug) {
        return tagRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    @Transactional(readOnly = true)
    public List<Tag> findAll() {
        return tagRepository.findAll();
    }
}
