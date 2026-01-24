package kaua.AI_Dev_Stack.controller;

import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.TagRequestDTO;
import kaua.AI_Dev_Stack.dto.response.TagResponseDTO;
import kaua.AI_Dev_Stack.mapper.TagMapper;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;
    private final TagMapper tagMapper;

    public TagController(TagService tagService, TagMapper tagMapper) {
        this.tagService = tagService;
        this.tagMapper = tagMapper;
    }

    @PostMapping
    public ResponseEntity<TagResponseDTO> findOrCreate(@Valid @RequestBody TagRequestDTO body) {
        Tag tag = tagService.findOrCreate(body.name());
        Long actualCount = tagService.getUsageCount(tag.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(tagMapper.toResponseDTO(tag, actualCount));
    }

    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> findAll() {
        List<TagResponseDTO> response = tagService.findAllWithCount().stream()
                .map(projection -> new TagResponseDTO(
                        projection.getId(),
                        projection.getName(),
                        projection.getUsageCount()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> findById(@PathVariable UUID id) {
        Tag tag = tagService.findById(id);
        Long actualCount = tagService.getUsageCount(id);

        return ResponseEntity.ok(tagMapper.toResponseDTO(tag, actualCount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
