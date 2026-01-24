package kaua.AI_Dev_Stack.repository;

import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.utils.TagProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

    Optional<Tag> findByNameIgnoreCase(String name);

    List<Tag> findByNameContainingIgnoreCase(String name);

    @Query(value = "SELECT t.id as id, t.name as name, COUNT(rt.resource_id) as usageCount " +
            "FROM tags t LEFT JOIN resource_tags rt ON t.id = rt.tag_id " +
            "GROUP BY t.id, t.name", nativeQuery = true)
    List<TagProjection> findAllWithUsageCount();

    // Esta query conta na tabela de relacionamento quantos Resources possuem o ID desta Tag
    @Query("SELECT COUNT(r) FROM Resource r JOIN r.tags t WHERE t.id = :tagId")
    Long countResourcesByTagId(@Param("tagId") UUID tagId);
}
