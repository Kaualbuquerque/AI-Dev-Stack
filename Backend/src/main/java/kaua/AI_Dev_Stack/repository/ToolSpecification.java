package kaua.AI_Dev_Stack.repository;

import jakarta.persistence.criteria.*;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.Upvote;
import kaua.AI_Dev_Stack.model.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ToolSpecification {

    public static Specification<Tool> withFilters(
            String search,
            String pricing,
            String type,
            List<String> stack,
            String tag,
            Boolean votedByMe,
            User currentUser) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Apenas ferramentas aprovadas
            predicates.add(cb.isTrue(root.get("isApproved")));

            // Busca por nome ou descrição
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            // Filtro de pricing
            if (pricing != null && !pricing.isBlank()) {
                predicates.add(cb.equal(
                        cb.lower(root.get("pricingModel").as(String.class)),
                        pricing.toLowerCase()
                ));
            }

            // Filtro de toolType
            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(
                        cb.lower(root.get("toolType").as(String.class)),
                        type.toLowerCase()
                ));
            }

            // Filtro de stacks
            if (stack != null && !stack.isEmpty()) {
                List<String> normalizedStack = stack.stream()
                        .map(String::toLowerCase)
                        .toList();

                Join<Object, Object> stackJoin = root.join("stacks", JoinType.INNER);
                predicates.add(cb.lower(stackJoin.as(String.class)).in(normalizedStack));

                // Evita duplicatas quando múltiplos stacks batem
                query.distinct(true);
            }

            // Filtro por tag
            if (tag != null && !tag.isBlank()) {
                Join<Object, Object> tagJoin = root.join("tags", JoinType.INNER);
                predicates.add(cb.like(
                        cb.lower(tagJoin.get("name")),
                        "%" + tag.toLowerCase() + "%"
                ));
                query.distinct(true);
            }


            if (votedByMe != null && votedByMe && currentUser != null) {
                Subquery<UUID> subquery = query.subquery(UUID.class);
                Root<Upvote> upvoteRoot = subquery.from(Upvote.class);
                subquery.select(upvoteRoot.get("tool").get("id"))
                        .where(cb.equal(upvoteRoot.get("user").get("id"), currentUser.getId()));
                predicates.add(root.get("id").in(subquery));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
