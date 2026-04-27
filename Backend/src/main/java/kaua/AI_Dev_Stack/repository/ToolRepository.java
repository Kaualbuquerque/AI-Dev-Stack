package kaua.AI_Dev_Stack.repository;

import jakarta.validation.constraints.NotBlank;
import kaua.AI_Dev_Stack.model.Tool;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ToolRepository extends JpaRepository<Tool, UUID>,
        JpaSpecificationExecutor<Tool> {
    Optional<Tool> findByNameIgnoreCase(String name);

    boolean existsByUrl(String url);
}
