package kaua.AI_Dev_Stack.repository;

import kaua.AI_Dev_Stack.model.Upvote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UpvoteRepository extends JpaRepository<Upvote, UUID> {

    // 1. Para contar os votos de uma IA específica
    long countByResourceId(UUID resourceId);

    // 2. Para verificar se o usuário atual já votou (muda a cor do botão no front)
    boolean existsByUserIdAndResourceId(UUID userId, UUID resourceId);

    // 3. Para deletar o voto (caso o usuário queira desfazer o upvote)
    void deleteByUserIdAndResourceId(UUID userId, UUID resourceId);
}
