package kaua.AI_Dev_Stack.mapper;

import kaua.AI_Dev_Stack.dto.request.UserRequestDTO;
import kaua.AI_Dev_Stack.dto.response.UserResponseDTO;
import kaua.AI_Dev_Stack.model.Enums.UserRole;
import kaua.AI_Dev_Stack.model.User;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public User toEntity(UserRequestDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setEmail(dto.email().toLowerCase().trim());
        user.setUsername(dto.username());
        user.setPassword(dto.password());
        user.setRole(UserRole.USER);

        return user;
    }

    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;

        // Se upvotes for null, stream() não será chamado, evitando erro.
        Set<UUID> upvotedResourceIds = Optional.ofNullable(user.getUpvotes())
                .orElse(Collections.emptyList()) // Garante uma lista vazia se for null
                .stream()
                .map(upvote -> upvote.getResource().getId())
                .collect(Collectors.toSet());

        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getCreatedAt(),
                upvotedResourceIds

        );
    }
}
