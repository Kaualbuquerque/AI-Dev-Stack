-- 1. Inserir Categorias
INSERT INTO categories (id, name, slug, icon_key)
VALUES (gen_random_uuid(), 'Backend', 'backend', 'layout'),
       (gen_random_uuid(), 'Frontend', 'frontend', 'layout'),
       (gen_random_uuid(), 'Inteligência Artificial', 'ai-tools', 'layout');

-- 2. Inserir Usuários (Movi para cima para o Resource poder encontrar o ID)
INSERT INTO users (id, created_at, email, password, role, username)
VALUES (gen_random_uuid(), now(), 'exemple@gmail.com', '12345678', 'ADMIN', 'DearSanta');

-- 3. Inserir Tags
INSERT INTO tags (id, name)
VALUES (gen_random_uuid(), 'Java'),
       (gen_random_uuid(), 'Spring Boot'),
       (gen_random_uuid(), 'React'),
       (gen_random_uuid(), 'PostgreSQL');

-- 4. Inserir Recursos (Corrigido princing -> pricing e ordem do User)
INSERT INTO resources (id, created_at, description, is_approved, long_description, pricing_model, slug, thumbnail_url,
                       title, url, category_id, user_id)
VALUES (gen_random_uuid(),
        now(),
        'Chatbot para resolução de problemas',
        true,
        'ChatGPT é uma IA criada pela OpenAI para ajudar pessoas a resolver problemas',
        'FREE',
        'chat-gpt',
        'http://exemple.com',
        'ChatGPT',
        'https://chatgpt.com/',
        (SELECT id FROM categories WHERE name = 'Inteligência Artificial' LIMIT 1),
       (SELECT id FROM users WHERE email = 'exemple@gmail.com' LIMIT 1)
    );