package kaua.AI_Dev_Stack.controller;

import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.UserRequestDTO;
import kaua.AI_Dev_Stack.dto.response.UserResponseDTO;
import kaua.AI_Dev_Stack.mapper.UserMapper;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRequestDTO body) {
        // 1. O Service processa a lógica de negócio e retorna a Entidade
        User user = userService.register(body);

        // 2. O Mapper transforma a Entidade no DTO de saída seguro
        UserResponseDTO response = userMapper.toResponseDTO(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
