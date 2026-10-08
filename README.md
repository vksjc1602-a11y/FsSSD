# AEGIS: AI-Enabled Guardian & Intelligence System
### Financial Scam & Fraud Detection Platform

AEGIS is an explainable financial scam and fraud detection platform engineered around one core user journey:
```
INPUT → SCAN → ANALYZE → RISK SCORE → EXPLAIN → RECOMMEND ACTION → ALERT / PROTECT
```

---

## 1. Visual & Architectural Identity
AEGIS enforces a calm, trustworthy financial security design system using the strict palette:
- **Primary / Obsidian**: `#102A23` (Navigation, headings, dark panels, brand wordmark)
- **Forest**: `#1F493B` (Selected navigation states, high-contrast controls)
- **Sage**: `#557A68` (Secondary typography, dividers, status icons)
- **Muted Sage**: `#9BAF9F` (Subtle indicators, metadata)
- **Warm Ivory**: `#F5F1E8` (Primary background canvas)
- **Soft Cream**: `#EAE3D5` (Cards, panels, secondary surfaces)
- **White**: `#FFFFFF` (Input fields, elevated surface cards)

---

## 2. Core User-Facing Structure
The main navigation contains strictly **5 items**:

1. **HOME**: Answers *"Am I safe?"*
   - Immediate security overview (`YOUR FINANCIAL SECURITY: PROTECTED`)
   - Recent activity counters (last scan, last alert, protected threats)
   - Quick Scan direct entry (`[ MESSAGE ]`, `[ URL ]`, `[ TRANSACTION ]`, `[ EMAIL ]`, `[ DOCUMENT ]`)
   - Priority recent alerts
2. **SCAN**: The core of AEGIS
   - Simple, unmistakable input interfaces for **MESSAGE**, **URL**, **TRANSACTION**, and **DOCUMENT**
   - 4-stage processing pipeline: `READING` → `PATTERN ANALYSIS` → `THREAT CHECK` → `RISK ASSESSMENT`
3. **RISK RESULT**: The primary decision screen
   - Clean risk score (`0–20 LOW`, `21–40 GUARDED`, `41–60 MODERATE`, `61–80 HIGH`, `81–100 CRITICAL`)
   - What AEGIS found (e.g., *Suspicious financial impersonation*)
   - Plain-language explanation ("WHY?") with numbered evidence points
   - Contributing factor attribution table
   - Direct, actionable recommendation (e.g. *DO NOT CLICK THE LINK*)
   - User feedback loop (`WAS THIS RESULT USEFUL? [ YES ] [ NO ]`)
4. **ALERTS**: Answers *"What requires my attention?"*
   - Clear categorized list (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) with reason and recommended action
5. **HISTORY**: Answers *"What have I checked?"*
   - Chronological ledger with date, type, risk score, and result
   - Fast search and category filter; click any item to reopen full analysis
6. **PROTECTION**: Answers *"How do I stay protected?"*
   - Master automatic protection toggle (`[ ON ]` / `[ OFF ]`)
   - Message scanning, URL protection, and transaction monitoring
   - Transparent permission disclosures explaining access, purpose, and data minimization
7. **SETTINGS & PRIVACY**: Minimal account controls, notification toggles, and cryptographic zero-retention commitments
8. **ADMIN CONSOLE**: Internal engineering suite for multi-dataset Kaggle normalization, ML model metrics, threat repositories, and audit logs.

---

## 3. Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Typography**: Inter (Prose), JetBrains Mono (Scores, IDs, Tabular figures).
- **Backend**: Express + Node.js with Vite middleware (`server.ts`).
- **Database**: Relational PostgreSQL schema (`src/db/schema.sql`).
