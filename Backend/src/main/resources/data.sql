-- 1. Inserir Tags
INSERT INTO tags (id, name, slug, icon_key)
VALUES (gen_random_uuid(), 'Code Gen', 'code-gen', 'code'),
       (gen_random_uuid(), 'UI', 'ui', 'layout'),
       (gen_random_uuid(), 'React', 'react', 'atom'),
       (gen_random_uuid(), 'Copilots', 'copilots', 'bot'),
       (gen_random_uuid(), 'IDE', 'ide', 'terminal'),
       (gen_random_uuid(), 'Data Science', 'data-science', 'database'),
       (gen_random_uuid(), 'LLMs', 'llms', 'brain'),
       (gen_random_uuid(), 'ML', 'ml', 'cpu'),
       (gen_random_uuid(), 'Terminal', 'terminal', 'command'),
       (gen_random_uuid(), 'Productivity', 'productivity', 'zap'),
       (gen_random_uuid(), 'Chatbots', 'chatbots', 'message-square'),
       (gen_random_uuid(), 'Code Search', 'code-search', 'search'),
       (gen_random_uuid(), 'Documentation', 'documentation', 'file-text') ON CONFLICT (name) DO NOTHING;

-- 2. Inserir Usuário (Senha '12345678' em BCrypt)
INSERT INTO users (id, created_at, email, password, role, username)
VALUES (gen_random_uuid(), now(), 'exemple@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqQ3a',
        'ADMIN', 'DearSanta') ON CONFLICT (email) DO NOTHING;

-- 3. Inserir Tool usando um Common Table Expression (CTE)
WITH inserted_tool AS (
INSERT
INTO tools (id,
            created_at,
            description,
            is_approved,
            pricing_model,
            thumbnail_url,
            name,
            url,
            user_id,
            featured,
            tool_type)
VALUES (
    gen_random_uuid(), now(), 'Chatbot para resolução de problemas', true, 'FREE', 'http://exemple.com', 'ChatGPT', 'https://chatgpt.com/', (SELECT id FROM users WHERE email = 'exemple@gmail.com' LIMIT 1), true, 'WEB'
    )
    RETURNING id
    )
-- 4. Associar a Tool às Tags (Tabela de junção ManyToMany)
        , insert_tags AS (
INSERT
INTO tools_tags (tool_id, tag_id)
SELECT it.id, t.id
FROM inserted_tool it, tags t
WHERE t.name IN ('Chatbots'
    , 'Productivity'
    , 'Code Gen')
    RETURNING tool_id
    )
-- 5. Inserir as Stacks (Tabela da @ElementCollection)
INSERT
INTO tool_stacks (tool_id, stack)
SELECT id, stack_val
FROM inserted_tool,
     (VALUES ('JAVA'), ('PYTHON')) AS t(stack_val);