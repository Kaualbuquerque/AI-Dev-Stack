package kaua.AI_Dev_Stack.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Tag name is required")
    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Column(unique = true)
    private String slug;

    @Column(name = "icon_key", length = 30)
    private String iconKey;

    // Relacionamentos

    // Relacionamento bidirecional: permite buscar recursos a partir da categoria
    // O 'mappedBy' indica que o lado "dono" do relacionamento é a Tool.
    @ManyToMany(mappedBy = "tags")
    @JsonIgnore // Importante para evitar o loop infinito no JSON que você mencionou
    private List<Tool> tools = new ArrayList<>();
}
