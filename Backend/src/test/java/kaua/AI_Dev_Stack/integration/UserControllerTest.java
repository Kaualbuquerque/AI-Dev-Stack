package kaua.AI_Dev_Stack.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import kaua.AI_Dev_Stack.dto.request.UserRequestDTO;
import kaua.AI_Dev_Stack.model.Enums.UserRole;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJson;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJson
@ActiveProfiles("test")
@DisplayName("UserController Integration Tests")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should register user successfully")
    void shouldRegisterUserSuccessfully() throws Exception {
        UserRequestDTO request = new UserRequestDTO(
                "newuser@email.com", "newuser", "password123"
        );

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("newuser@email.com"))
                .andExpect(jsonPath("$.username").value("newuser"));
    }

    @Test
    @DisplayName("Should return 409 when email already exists")
    void shouldReturn409WhenEmailAlreadyExists() throws Exception {
        User existing = new User();
        existing.setEmail("existing@email.com");
        existing.setUsername("existing");
        existing.setPassword(passwordEncoder.encode("password"));
        existing.setRole(UserRole.USER);
        userRepository.save(existing);

        UserRequestDTO request = new UserRequestDTO(
                "existing@email.com", "newuser", "password123"
        );

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should return 400 when email is invalid")
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        UserRequestDTO request = new UserRequestDTO(
                "invalid-email", "newuser", "password123"
        );

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
