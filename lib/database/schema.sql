-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    level_id INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Levels table
CREATE TABLE public.levels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    order_number INTEGER NOT NULL UNIQUE,
    xp_required INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kanji table
CREATE TABLE public.kanji (
    id SERIAL PRIMARY KEY,
    level_id INTEGER REFERENCES public.levels(id),
    character TEXT NOT NULL UNIQUE,
    meaning TEXT NOT NULL,
    onyomi TEXT,
    kunyomi TEXT,
    strokes INTEGER,
    examples TEXT[],
    anime_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Words table
CREATE TABLE public.words (
    id SERIAL PRIMARY KEY,
    level_id INTEGER REFERENCES public.levels(id),
    kanji_id INTEGER REFERENCES public.kanji(id),
    word TEXT NOT NULL,
    reading TEXT NOT NULL,
    meaning TEXT NOT NULL,
    examples TEXT[],
    anime_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Phrases table
CREATE TABLE public.phrases (
    id SERIAL PRIMARY KEY,
    level_id INTEGER REFERENCES public.levels(id),
    japanese TEXT NOT NULL,
    reading TEXT NOT NULL,
    meaning TEXT NOT NULL,
    anime_source TEXT,
    anime_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table (SRS)
CREATE TABLE public.reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('kanji', 'word', 'phrase')),
    item_id INTEGER NOT NULL,
    srs_level INTEGER DEFAULT 0,
    interval INTEGER DEFAULT 1,
    ease_factor DECIMAL(3,2) DEFAULT 2.5,
    next_review_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

-- Daily streaks tracking
CREATE TABLE public.daily_activities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    reviews_completed INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, activity_date)
);

-- XP history
CREATE TABLE public.xp_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_reviews_user_next ON public.reviews(user_id, next_review_at);
CREATE INDEX idx_profiles_level ON public.profiles(level_id);
CREATE INDEX idx_kanji_level ON public.kanji(level_id);
CREATE INDEX idx_words_level ON public.words(level_id);
CREATE INDEX idx_phrases_level ON public.phrases(level_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();