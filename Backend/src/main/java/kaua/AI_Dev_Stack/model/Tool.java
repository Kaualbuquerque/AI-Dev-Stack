package kaua.AI_Dev_Stack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import kaua.AI_Dev_Stack.model.Enums.StackType;
import kaua.AI_Dev_Stack.model.Enums.ToolType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "tools") // Define o nome da tabela no Postgres
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tool {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UUID é mais seguro para APIs modernas que Long
    private UUID id;

    @NotBlank(message = "Name is required and cannot be empty") // Validação: não permite nulo nem strings vazias ""
    @Column(nullable = false, length = 100) // Restrição no Banco de Dados
    private String name;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 500)
    private String description;

    @NotBlank(message = "URL is required")
    @URL(message = "Invalid URL") // Validação específica para garantir que é um link válido
    @Column(nullable = false, unique = true)
    private String url;

    @URL(message = "Invalid thumbnail URL")
    private String thumbnailUrl;

    @NotNull(message = "Pricing model must be specified") // Para Enums usamos @NotNull
    @Enumerated(EnumType.STRING)
    private PricingType pricingModel;

    @Column(nullable = false)
    private boolean isApproved = false; // Valor padrão inicial

    @CreationTimestamp
    @Column(updatable = false) // Garante que a data de criação nunca mude no UPDATE
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean featured = false;

    @NotNull(message = "Tool type is required")
    @Enumerated(EnumType.STRING)
    private ToolType toolType;

    @ElementCollection
    @CollectionTable(name = "tool_stacks", joinColumns = @JoinColumn(name = "tool_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "stack")
    private List<StackType> stacks = new ArrayList<>();

    @Column(name = "upvotes_count", nullable = false)
    private int upvotesCount = 0;

    // Relacionamentos

    @NotEmpty(message = "At least one tag is required")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tools_tags",
            joinColumns = @JoinColumn(name = "tool_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @NotNull(message = "Owner user is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "tool", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Upvote> upvotes = new ArrayList<>();
}
