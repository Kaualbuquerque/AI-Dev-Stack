package kaua.AI_Dev_Stack.repository;

import kaua.AI_Dev_Stack.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

    Optional<Tag> findBySlugIgnoreCase(String slug);

    boolean existsByName(String name);
}
