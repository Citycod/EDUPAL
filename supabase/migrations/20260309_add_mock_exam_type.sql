-- Migration to add 'mock-exam' to ai_quizzes type constraint
ALTER TABLE academic.ai_quizzes DROP CONSTRAINT IF EXISTS ai_quizzes_type_check;
ALTER TABLE academic.ai_quizzes ADD CONSTRAINT ai_quizzes_type_check CHECK (type IN ('flashcards', 'quiz', 'mock-exam'));
