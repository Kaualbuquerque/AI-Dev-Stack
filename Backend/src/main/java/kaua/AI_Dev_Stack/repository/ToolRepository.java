package kaua.AI_Dev_Stack.repository;

import kaua.AI_Dev_Stack.model.Tool;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ToolRepository extends JpaRepository<Tool, UUID> {

    // Lista recursos aprovados com suporte a paginação (ex: para a Home)
    Page<Tool> findByIsApprovedTrue(Pageable pageable);

}
