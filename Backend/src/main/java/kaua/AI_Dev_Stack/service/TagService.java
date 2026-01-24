package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.repository.TagRepository;
import kaua.AI_Dev_Stack.utils.TagProjection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Transactional
    public Tag findOrCreate(String name) {
        String cleanedName = name.trim().toLowerCase();

        return tagRepository.findByNameIgnoreCase(cleanedName)
                .orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setName(cleanedName);
                    return tagRepository.save(newTag);
                });
    }

    @Transactional(readOnly = true)
    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tag findById(UUID id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    @Transactional(readOnly = true)
    public List<TagProjection> findAllWithCount() {
        return tagRepository.findAllWithUsageCount();
    }

    @Transactional(readOnly = true)
    public Long getUsageCount(UUID tagId) {
        return tagRepository.countResourcesByTagId(tagId);
    }

    @Transactional
    public void delete(UUID id) {
        if (tagRepository.countResourcesByTagId(id) > 0) {
            throw new RuntimeException("Cannot delete tag: it is being used by one or more resources.");
        }
        tagRepository.deleteById(id);
    }
}
