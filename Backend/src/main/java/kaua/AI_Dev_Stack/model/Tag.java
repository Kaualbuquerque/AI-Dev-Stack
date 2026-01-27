package kaua.AI_Dev_Stack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "")
    @Column(unique = true, nullable = false)
    private String name;

    // Relacionamentos

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private Set<Resource> resources = new HashSet<>();
}
