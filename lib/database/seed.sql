-- Insert levels
INSERT INTO public.levels (name, description, order_number, xp_required) VALUES
('Nível 1 - Iniciante', 'Primeiros passos no japonês dos animes', 1, 0),
('Nível 2 - Básico', 'Fundamentos do dia a dia em animes', 2, 100);

-- Insert Kanji (Nível 1)
INSERT INTO public.kanji (level_id, character, meaning, onyomi, kunyomi, anime_context) VALUES
(1, '一', 'um', 'いち', 'ひと', 'Comum em títulos como "One Piece"'),
(1, '二', 'dois', 'に', 'ふた', 'Usado em contagens'),
(1, '三', 'três', 'さん', 'み', 'Presente em nomes de personagens'),
(1, '四', 'quatro', 'し', 'よん', 'Cuidado: "shi" também significa morte'),
(1, '五', 'cinco', 'ご', 'いつ', 'Comum em palavras do dia a dia');

-- Insert Kanji (Nível 2)
INSERT INTO public.kanji (level_id, character, meaning, onyomi, kunyomi, anime_context) VALUES
(2, '人', 'pessoa', 'じん', 'ひと', 'Usado em "Ningen" (humano) em Dragon Ball'),
(2, '火', 'fogo', 'か', 'ひ', 'Jutsu de fogo em Naruto'),
(2, '水', 'água', 'すい', 'みず', 'Elemento água em muitos animes'),
(2, '木', 'árvore', 'もく', 'き', 'Presente em nomes como "Kimetsu"'),
(2, '金', 'ouro', 'きん', 'かね', 'Usado em "Kin" (dinheiro)');

-- Insert Words (Nível 1)
INSERT INTO public.words (level_id, kanji_id, word, reading, meaning, anime_context) VALUES
(1, 1, '一人', 'ひとり', 'uma pessoa', 'Comum em músicas de anime'),
(1, 2, '二人', 'ふたり', 'duas pessoas', 'Usado em duplas de personagens'),
(1, 3, '三日', 'みっか', 'três dias', 'Prazos em animes'),
(1, NULL, 'ありがとう', 'ありがとう', 'obrigado', 'Frase básica em todo anime'),
(1, NULL, 'こんにちは', 'こんにちは', 'olá', 'Saudação universal em animes'),
(1, NULL, 'さようなら', 'さようなら', 'adeus', 'Despedidas emocionantes'),
(1, NULL, 'はい', 'はい', 'sim', 'Resposta afirmativa'),
(1, NULL, 'いいえ', 'いいえ', 'não', 'Resposta negativa');

-- Insert Words (Nível 2)
INSERT INTO public.words (level_id, kanji_id, word, reading, meaning, anime_context) VALUES
(2, 6, '日本人', 'にほんじん', 'pessoa japonesa', 'Comum em diálogos'),
(2, 7, '火事', 'かじ', 'incêndio', 'Situações de perigo em animes'),
(2, 8, '水曜日', 'すいようび', 'quarta-feira', 'Dias da semana'),
(2, 9, '木曜日', 'もくようび', 'quinta-feira', 'Dias da semana'),
(2, 10, 'お金', 'おかね', 'dinheiro', 'Tema recorrente'),
(2, NULL, 'すごい', 'すごい', 'incrível', 'Reação comum em animes'),
(2, NULL, 'やばい', 'やばい', 'perigoso/incrível', 'Gíria moderna');

-- Insert Phrases (Nível 1)
INSERT INTO public.phrases (level_id, japanese, reading, meaning, anime_source) VALUES
(1, 'おはようございます', 'おはようございます', 'Bom dia', 'Slice of Life'),
(1, 'こんばんは', 'こんばんは', 'Boa noite', 'Vampire Knight'),
(1, 'おやすみなさい', 'おやすみなさい', 'Boa noite (dormir)', 'Usual em animes'),
(1, 'いただきます', 'いただきます', 'Bom apetite', 'Food Wars'),
(1, 'ごちそうさまでした', 'ごちそうさまでした', 'Obrigado pela refeição', 'Food Wars');

-- Insert Phrases (Nível 2)
INSERT INTO public.phrases (level_id, japanese, reading, meaning, anime_source) VALUES
(2, '私の名前は田中です', 'わたしのなまえはたなかです', 'Meu nome é Tanaka', 'Apresentações'),
(2, 'どこに行きますか？', 'どこにいきますか？', 'Onde você vai?', 'Dragon Ball'),
(2, '何を食べますか？', 'なにをたべますか？', 'O que você vai comer?', 'Food Wars'),
(2, '大好きです', 'だいすきです', 'Eu amo muito', 'Romance animes'),
(2, '頑張ってください', 'がんばってください', 'Faça o seu melhor', 'Esportes animes');