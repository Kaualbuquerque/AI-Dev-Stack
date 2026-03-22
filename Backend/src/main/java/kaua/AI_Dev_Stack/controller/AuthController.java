package kaua.AI_Dev_Stack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kaua.AI_Dev_Stack.dto.request.LoginRequestDTO;
import kaua.AI_Dev_Stack.dto.response.LoginResponseDTO;
import kaua.AI_Dev_Stack.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates user and returns JWT token")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO body) {
        return ResponseEntity.ok(authService.login(body));
    }
}
