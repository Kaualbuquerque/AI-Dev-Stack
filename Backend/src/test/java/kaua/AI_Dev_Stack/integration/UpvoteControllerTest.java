package kaua.AI_Dev_Stack.integration;

import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.StackType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;
import kaua.AI_Dev_Stack.model.Enums.UserRole;
import kaua.AI_Dev_Stack.model.Tag;
import kaua.AI_Dev_Stack.model.Tool;
import kaua.AI_Dev_Stack.model.User;
import kaua.AI_Dev_Stack.repository.TagRepository;
import kaua.AI_Dev_Stack.repository.ToolRepository;
import kaua.AI_Dev_Stack.repository.UpvoteRepository;
import kaua.AI_Dev_Stack.repository.UserRepository;
import kaua.AI_Dev_Stack.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJson;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJson
@ActiveProfiles("test")
@DisplayName("Upvote Integration Tests")

public class UpvoteControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ToolRepository toolRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private UpvoteRepository upvoteRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private User user;
    private Tool tool;
    private String userToken;

    @BeforeEach
    void setUp() {
        upvoteRepository.deleteAll();
        toolRepository.deleteAll();
        tagRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setEmail("user@test.com");
        user.setUsername("testuser");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(UserRole.USER);
        userRepository.save(user);

        Tag tag = new Tag();
        tag.setName("test tag");
        tag.setSlug("test-tag");
        tag.setIconKey("tag");
        tagRepository.save(tag);

        tool = new Tool();
        tool.setName("Test Tool");
        tool.setDescription("Description");
        tool.setUrl("https://testtool.com");
        tool.setPricingModel(PricingType.FREE);
        tool.setToolType(ToolType.WEB);
        tool.setStacks(List.of(StackType.JAVA));
        tool.setTags(List.of(tag));
        tool.setUser(user);
        tool.setApproved(true);
        tool.setUpvotesCount(0);
        toolRepository.save(tool);

        userToken = "Bearer " + jwtService.generateToken(user.getEmail());
    }

    @Test
    @DisplayName("Should add upvote successfully")
    void shouldAddUpvoteSuccessfully() throws Exception {
        mockMvc.perform(post("/tools/" + tool.getId() + "/upvote")
                        .header("Authorization", userToken))
                .andExpect(status().isOk());

        Tool updated = toolRepository.findById(tool.getId()).orElseThrow();
        assertThat(updated.getUpvotesCount()).isEqualTo(1);
        assertThat(upvoteRepository.existsByUserIdAndToolId(user.getId(), tool.getId())).isTrue();
    }

    @Test
    @DisplayName("Should remove upvote when already voted")
    void shouldRemoveUpvoteWhenAlreadyVoted() throws Exception {
        // Primeiro upvote
        mockMvc.perform(post("/tools/" + tool.getId() + "/upvote")
                        .header("Authorization", userToken))
                .andExpect(status().isOk());

        // Remove o upvote
        mockMvc.perform(post("/tools/" + tool.getId() + "/upvote")
                        .header("Authorization", userToken))
                .andExpect(status().isOk());

        Tool updated = toolRepository.findById(tool.getId()).orElseThrow();
        assertThat(updated.getUpvotesCount()).isEqualTo(0);
        assertThat(upvoteRepository.existsByUserIdAndToolId(user.getId(), tool.getId())).isFalse();
    }

    @Test
    @DisplayName("Should return 401 when upvoting without authentication")
    void shouldReturn401WhenUpvotingWithoutAuth() throws Exception {
        mockMvc.perform(post("/tools/" + tool.getId() + "/upvote"))
                .andExpect(status().isUnauthorized());
    }
}
