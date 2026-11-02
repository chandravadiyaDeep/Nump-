# NUMPA Analysis History Architecture & Metadata Schema Proposal

**Status:** Technical Architecture Proposal (Awaiting Schema Approval)  
**Document Version:** 1.0.0  
**Phase:** Commercial V1 — Phase 6  
**Audience:** Database Administrator, Security Reviewer, Product Lead  

---

## 1. Context & Honest Baseline

During Commercial V1 Phase 5, the repository deliberately did **not** implement persistent database storage for analysis records.

The application adheres to an explicit privacy contract:
- Uploaded dataset contents and rows are processed in memory and kept in temporary browser session state.
- The `AnalysisHistoryWorkspace` component in the frontend displays an honest message:  
  `No approved metadata-only history store is configured in this app.`

This document outlines the proposed **metadata-only** persistence model for when the repository owner approves database persistence.

---

## 2. Privacy-Preserving Metadata Model

Under no circumstances should raw datasets, row values, or customer records be persisted into the database.

The history system stores **only** operational summary metadata:

```text
[ Allowed in History ]                       [ STRICTLY FORBIDDEN ]
- Analysis ID & timestamp                    - Raw CSV/Excel rows or cells
- Original filename (e.g., "sales.csv")       - Customer personal identifiable information (PII)
- Dataset format & file size in bytes        - Feature values or individual data records
- Row count & column count                   - Proprietary training labels
- List of column names and inferred types    - Raw file binary blobs in Supabase Storage
- Cleaning actions executed (counts only)
- ML readiness score (0-100) & dimensions
- Benchmark model accuracy / F1 metrics
```

---

## 3. Proposed Supabase Schema (Metadata Only)

> [!NOTE]
> This schema is presented for future approval and has **not** been applied to the live database.

```sql
-- Table: public.analysis_history
CREATE TABLE IF NOT EXISTS public.analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_format VARCHAR(32) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    total_rows INT NOT NULL,
    total_columns INT NOT NULL,
    column_names TEXT[] NOT NULL,
    quality_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    cleaning_summary JSONB,
    ml_readiness_score NUMERIC(5, 2),
    ml_task VARCHAR(64),
    ml_target VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS)
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Users can only view their own history
CREATE POLICY "Users can query own analysis history"
    ON public.analysis_history
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can insert their own analysis records
CREATE POLICY "Users can record own analysis summary"
    ON public.analysis_history
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history entries
CREATE POLICY "Users can delete own history"
    ON public.analysis_history
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
```

---

## 4. Current Status

The history feature remains in its honest, unavailable state (`HISTORY_PERSISTENCE_ENABLED = false` in `workspace-settings-model.mjs`). No records are fabricated, and no raw data is collected.
