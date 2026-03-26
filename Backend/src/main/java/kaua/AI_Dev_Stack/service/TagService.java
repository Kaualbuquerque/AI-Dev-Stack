package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.TagRequestDTO;
import kaua.AI_Dev_Stack.exceptions.DuplicateResourceException;
import kaua.AI_Dev_Stack.exceptions.ResourceNotFoundException;
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
            throw new DuplicateResourceException("Tag with name " + dto.name() + " already exists.");
        }

        Tag tag = tagMapper.toEntity(dto);
        tag.setSlug(SlugUtils.generateSlug(dto.name()));


        return tagRepository.save(tag);
    }

    @Transactional(readOnly = true)
    public Tag findById(UUID id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
    }

    @Transactional(readOnly = true)
    public Tag findBySlug(String slug) {
        return tagRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
    }

    @Transactional(readOnly = true)
    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    @Transactional
    public Tag update(UUID id, TagRequestDTO dto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found."));

        if (!tag.getName().equals(dto.name()) && tagRepository.existsByName(dto.name())) {
            throw new DuplicateResourceException("Tag with name " + dto.name() + " already exists.");
        }

        tag.setName(dto.name().toLowerCase().trim());
        tag.setSlug(SlugUtils.generateSlug(dto.name()));
        tag.setIconKey(dto.iconKey());

        return tagRepository.save(tag);
    }

    @Transactional
    public void delete(UUID id){
        if (!tagRepository.existsById(id)){
            throw new ResourceNotFoundException("Tag not found.");
        }
        tagRepository.deleteById(id);
    }
}
