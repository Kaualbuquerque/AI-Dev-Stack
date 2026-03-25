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
       (gen_random_uuid(), 'Documentation', 'documentation', 'file-text');

INSERT INTO users (id, created_at, email, password, role, username)
VALUES (gen_random_uuid(), now(), 'exemple@gmail.com', '12345678', 'ADMIN', 'DearSanta');

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
            tool_type,
            )
VALUES (
    gen_random_uuid(), now(), 'Chatbot para resolução de problemas', true, 'FREE', 'http://exemple.com', 'ChatGPT', 'https://chatgpt.com/', (SELECT id FROM users WHERE email = 'exemple@gmail.com' LIMIT 1), true, 'WEB'
    )
    RETURNING id
    )
-- 2. Associamos a Tool às categorias na tabela de junção
INSERT
INTO tools_tags (tool_id, category_id)
SELECT inserted_tool.id,
       tags.id
FROM inserted_tool,
     tags
WHERE tags.name IN ('Chatbots', 'Productivity', 'Code Gen');