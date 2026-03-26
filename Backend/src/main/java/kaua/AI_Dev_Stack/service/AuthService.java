package kaua.AI_Dev_Stack.service;

import kaua.AI_Dev_Stack.dto.request.LoginRequestDTO;
import kaua.AI_Dev_Stack.dto.response.LoginResponseDTO;
import kaua.AI_Dev_Stack.exceptions.ResourceNotFoundException;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.UserRepository;
import kaua.AI_Dev_Stack.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        // Autentica - Lança exceção se credenciais inválidas
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        // Busca o usuário
        User user = userRepository.findByEmailIgnoreCase(dto.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        // Gera o token
        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponseDTO(token, user.getEmail(), user.getUsername());
    }
}
