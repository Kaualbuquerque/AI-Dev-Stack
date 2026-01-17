package kaua.AI_Dev_Stack.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Category name is required")
    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Column(name = "icon_key", length = 30)
    private String iconKey;

    // Relacionamentos

    // Relacionamento bidirecional: permite buscar recursos a partir da categoria
    // mappedBy deve ter o mesmo nome do atributo 'category' dentro da classe Resource
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resource> resources = new ArrayList<>();
}
