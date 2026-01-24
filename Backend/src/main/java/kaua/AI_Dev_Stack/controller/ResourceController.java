package kaua.AI_Dev_Stack.controller;

import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.ResourceRequestDTO;
import kaua.AI_Dev_Stack.dto.response.ResourceResponseDTO;
import kaua.AI_Dev_Stack.mapper.ResourceMapper;
import kaua.AI_Dev_Stack.model.Resource;
import kaua.AI_Dev_Stack.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resources")
public class ResourceController {
    private final ResourceService resourceService;
    private final ResourceMapper resourceMapper;

    public ResourceController(ResourceService resourceService, ResourceMapper resourceMapper) {
        this.resourceService = resourceService;
        this.resourceMapper = resourceMapper;
    }

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> save(@Valid @RequestBody ResourceRequestDTO body) {
        Resource resource = resourceService.save(body);

        ResourceResponseDTO response = resourceMapper.toResponseDTO(resource);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<Resource>> findAll(Pageable pageable) {
        return ResponseEntity.ok(resourceService.findAllApproved(pageable));
    }

    // @GetMapping("/{slug}")
    // public ResponseEntity<Page<Resource>> findBySlug(@PathVariable String slug){
    //     return ResponseEntity.();
    // }
}
