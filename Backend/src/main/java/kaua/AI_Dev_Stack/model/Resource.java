package kaua.AI_Dev_Stack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import kaua.AI_Dev_Stack.model.Enums.PricingType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "Resources") // Define o nome da tabela no Postgres
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UUID é mais seguro para APIs modernas que Long
    private UUID id;

    @NotBlank(message = "Title is required and cannot be empty") // Validação: não permite nulo nem strings vazias ""
    @Column(nullable = false, length = 100) // Restrição no Banco de Dados
    private String title;

    @Column(unique = true) // Garante que não existam dois recursos com o mesmo slug
    private String slug;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 255)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    @NotBlank(message = "URL is required")
    @URL(message = "Invalid URL") // Validação específica para garantir que é um link válido
    @Column(nullable = false, unique = true)
    private String url;

    private String thumbnailUrl;

    @NotNull(message = "Pricing model must be specified") // Para Enums usamos @NotNull
    @Enumerated(EnumType.STRING)
    private PricingType pricingModel;

    @Column(nullable = false)
    private boolean isApproved = false; // Valor padrão inicial

    @CreationTimestamp
    @Column(updatable = false) // Garante que a data de criação nunca mude no UPDATE
    private LocalDateTime createdAt;

    // Relacionamentos

    @NotNull(message = "Category is required") // Para objetos usamos @NotNull
    @ManyToOne(fetch = FetchType.LAZY) // LAZY evita carregar a categoria sem necessidade (performance)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Utilizar o objeto criado posteriormente

    @NotNull(message = "Owner user is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotEmpty(message = "At least one tag must be assigned to the resource")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "resource_tags",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "resource", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Upvote> upvotes = new ArrayList<>();
}
