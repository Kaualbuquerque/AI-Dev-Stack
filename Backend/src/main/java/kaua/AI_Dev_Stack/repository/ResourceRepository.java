package kaua.AI_Dev_Stack.repository;

import kaua.AI_Dev_Stack.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    // Busca um recurso específico pela URL amigável
    Optional<Resource> findBySlugIgnoreCase(String slug);

    // Lista recursos aprovados com suporte a paginação (ex: para a Home)
    Page<Resource> findByIsApprovedTrue(Pageable pageable);

    // Verifica se já existe um recurso com determinada URL (evita duplicatas)
    boolean existsByUrl(String url);
}
