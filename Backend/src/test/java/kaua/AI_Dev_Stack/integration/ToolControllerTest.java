package kaua.AI_Dev_Stack.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import kaua.AI_Dev_Stack.dto.request.ToolRequestDTO;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.StackType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;
import kaua.AI_Dev_Stack.model.Enums.UserRole;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.TagRepository;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import kaua.AI_Dev_Stack.repository.UserRepository;
import kaua.AI_Dev_Stack.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJson;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJson
@ActiveProfiles("test")
@DisplayName("ToolController Integration Tests")
public class ToolControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ToolRepository toolRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    private User user;
    private User admin;
    private Tag tag;
    private String userToken;
    private String adminToken;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        toolRepository.deleteAll();
        tagRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setEmail("user@test.com");
        user.setUsername("testuser");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(UserRole.USER);
        userRepository.save(user);

        admin = new User();
        admin.setEmail("admin@test.com");
        admin.setUsername("testadmin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        userRepository.save(admin);

        tag = new Tag();
        tag.setName("code assistant");
        tag.setSlug("code-assistant");
        tag.setIconKey("code");
        tagRepository.save(tag);

        userToken = "Bearer " + jwtService.generateToken(user.getEmail());
        adminToken = "Bearer " + jwtService.generateToken(admin.getEmail());
    }

    @Test
    @DisplayName("Should return tools list successfully")
    void shouldReturnToolsListSuccessfully() throws Exception {
        mockMvc.perform(get("/tools"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @DisplayName("Should suggest tool successfully when authenticated")
    void shouldSuggestToolSuccessfully() throws Exception {
        ToolRequestDTO request = new ToolRequestDTO(
                "New Tool",
                "A new AI tool description",
                "https://newtool.com",
                "https://newtool.com/favicon.png",
                PricingType.FREE,
                ToolType.WEB,
                List.of(StackType.JAVA),
                List.of(tag.getId())
        );

        mockMvc.perform(post("/tools")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Tool"));
    }

    @Test
    @DisplayName("Should return 401 when suggesting tool without authentication")
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        ToolRequestDTO request = new ToolRequestDTO(
                "New Tool", "Description", "https://newtool.com",
                null, PricingType.FREE, ToolType.WEB,
                List.of(StackType.JAVA), List.of(tag.getId())
        );

        mockMvc.perform(post("/tools")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should approve tool when admin")
    void shouldApproveToolWhenAdmin() throws Exception {
        Tool tool = new Tool();
        tool.setName("Pending Tool");
        tool.setDescription("Description");
        tool.setUrl("https://pendingtool.com");
        tool.setPricingModel(PricingType.FREE);
        tool.setToolType(ToolType.WEB);
        tool.setStacks(List.of(StackType.JAVA));
        tool.setTags(List.of(tag));
        tool.setUser(user);
        tool.setApproved(false);
        toolRepository.save(tool);

        mockMvc.perform(patch("/tools/" + tool.getId() + "/approve")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isApproved").value(true));
    }

    @Test
    @DisplayName("Should return 403 when non-admin tries to approve tool")
    void shouldReturn403WhenNonAdminApprovesTool() throws Exception {
        mockMvc.perform(patch("/tools/" + java.util.UUID.randomUUID() + "/approve")
                        .header("Authorization", userToken))
                .andExpect(status().isForbidden());
    }
}
