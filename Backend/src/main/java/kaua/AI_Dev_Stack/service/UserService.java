package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.UserRequestDTO;
import kaua.AI_Dev_Stack.dto.request.UserUpdateDTO;
import kaua.AI_Dev_Stack.exceptions.DuplicateResourceException;
import kaua.AI_Dev_Stack.exceptions.ResourceNotFoundException;
import kaua.AI_Dev_Stack.mapper.UserMapper;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new DuplicateResourceException("This email address is already in use.");
        }

        User user = userMapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.password()));

        return userRepository.save(user);
    }

    @Transactional
    public User update(User currentUser, UserUpdateDTO dto) {
        if (dto.username() != null) {
            currentUser.setUsername(dto.username());
        }

        if (dto.password() != null) {
            currentUser.setPassword(passwordEncoder.encode(dto.password()));
        }

        return userRepository.save(currentUser);
    }

    @Transactional
    public void delete(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
