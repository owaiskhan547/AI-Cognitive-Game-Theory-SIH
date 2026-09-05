-- Cognitive game score storage
CREATE TABLE public.game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL CHECK (game_type IN ('memory_match', 'sequence_recall', 'pattern_recall', 'word_recall')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    score INTEGER NOT NULL CHECK (score >= 0),
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_game_scores_patient ON public.game_scores(patient_id);
CREATE INDEX idx_game_scores_completed_at ON public.game_scores(completed_at DESC);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access game scores"
ON public.game_scores FOR ALL
TO authenticated
USING (public.can_access_patient(patient_id, auth.uid()))
WITH CHECK (public.can_access_patient(patient_id, auth.uid()));
