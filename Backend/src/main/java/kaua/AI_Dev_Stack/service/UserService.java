package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.UserRequestDTO;
import kaua.AI_Dev_Stack.mapper.UserMapper;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    public User register(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("This email address is already in use.");
        }

        User user = userMapper.toEntity(dto);

        // TODO: Criptografar senha aqui antes de salvar
        // user.setPassword(encoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    @Transactional(readOnly = true)
    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }
}
