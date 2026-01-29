-- Inserir Categorias Iniciais
-- Nota: O ID é UUID, mas para o PostgreSQL podes usar gen_random_uuid() se a tua versão suportar,
-- ou deixar o Hibernate criar e apenas inserir nomes e slugs.
INSERT INTO categories (id, name, slug, icon_key) VALUES (gen_random_uuid(), 'Backend', 'backend', 'layout');
INSERT INTO categories (id, name, slug, icon_key) VALUES (gen_random_uuid(), 'Frontend', 'frontend', 'layout');
INSERT INTO categories (id, name, slug, icon_key) VALUES (gen_random_uuid(), 'Inteligência Artificial', 'ai-tools', 'layout');

-- Inserir algumas Tags
INSERT INTO tags (id, name) VALUES (gen_random_uuid(), 'Java');
INSERT INTO tags (id, name) VALUES (gen_random_uuid(), 'Spring Boot');
INSERT INTO tags (id, name) VALUES (gen_random_uuid(), 'React');
INSERT INTO tags (id, name) VALUES (gen_random_uuid(), 'PostgreSQL');