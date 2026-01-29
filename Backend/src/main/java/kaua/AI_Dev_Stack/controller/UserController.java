package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "Users",
        description = "User profile and account management"
)
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    @Operation(
            summary = "Register a new user",
            description = "Creates a unique user account in the system"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User successfully registered"),
            @ApiResponse(responseCode = "400", description = "Validation error (e.g., invalid email format or empty fields)"),
            @ApiResponse(responseCode = "409", description = "Conflict: Email or Username already taken"),
            @ApiResponse(responseCode = "500", description = "Internal server error during registration")
    })
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRequestDTO body) {
        // 1. O Service processa a lógica de negócio e retorna a Entidade
        User user = userService.register(body);

        // 2. O Mapper transforma a Entidade no DTO de saída seguro
        UserResponseDTO response = userMapper.toResponseDTO(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
