package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.repository.TagRepository;
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
    public List<Tag> findAll(){
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tag findById(UUID id){
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    @Transactional
    public void delete(UUID id){
        tagRepository.deleteById(id);
    }
}
