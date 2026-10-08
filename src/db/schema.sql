-- ========================================================
-- AEGIS: AI-Enabled Guardian & Intelligence System
-- Production Relational PostgreSQL Database Schema
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS & TEAMS
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'ENTERPRISE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS & ROLES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'ANALYST',
    is_mfa_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);

-- 3. DATASETS & REPOSITORIES (KAGGLE / FEEDS)
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'KAGGLE', 'ENTERPRISE_FEED', 'SYNTHETIC'
    target_schema VARCHAR(50) NOT NULL, -- 'MESSAGE_EVENT', 'TRANSACTION_EVENT', 'URL_EVENT'
    records_count INTEGER NOT NULL DEFAULT 0,
    missing_pct NUMERIC(5, 2) DEFAULT 0.00,
    duplicate_pct NUMERIC(5, 2) DEFAULT 0.00,
    quality_score NUMERIC(5, 2) DEFAULT 100.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    column_mappings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataset_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    raw_payload JSONB NOT NULL,
    normalized_payload JSONB,
    ground_truth_label VARCHAR(100),
    is_validated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dataset_records_ds ON dataset_records(dataset_id);

-- 4. MACHINE LEARNING MODELS & REGISTRY
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    active_version VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PRODUCTION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES models(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    dataset_id UUID REFERENCES datasets(id),
    accuracy NUMERIC(5, 2),
    precision NUMERIC(5, 2),
    recall NUMERIC(5, 2),
    f1_score NUMERIC(5, 2),
    roc_auc NUMERIC(6, 4),
    false_positive_rate NUMERIC(5, 2),
    confusion_matrix JSONB,
    feature_importances JSONB,
    promoted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_model_versions_mid ON model_versions(model_id);

-- 5. SCAN REQUESTS & VERDICT RESULTS
CREATE TABLE scan_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_code VARCHAR(50) UNIQUE NOT NULL,
    input_type VARCHAR(50) NOT NULL, -- 'MESSAGE', 'URL', 'TRANSACTION', 'EMAIL'
    hashed_input VARCHAR(64) NOT NULL,
    sanitized_input TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_request_id UUID REFERENCES scan_requests(id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'GUARDED', 'MODERATE', 'HIGH', 'CRITICAL'
    confidence NUMERIC(5, 2) NOT NULL,
    classification VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    component_scores JSONB NOT NULL,
    factors JSONB NOT NULL,
    reasons JSONB NOT NULL,
    recommended_actions JSONB NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scan_results_severity ON scan_results(severity);
CREATE INDEX idx_scan_results_score ON scan_results(risk_score);

-- 6. TRANSACTIONS
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    txn_reference VARCHAR(100) UNIQUE NOT NULL,
    sender_account_masked VARCHAR(100) NOT NULL,
    recipient_account VARCHAR(100) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    channel VARCHAR(20) NOT NULL, -- 'UPI', 'NEFT', 'IMPS', 'CARD', 'WIRE'
    description TEXT,
    anomaly_score INTEGER NOT NULL,
    risk_score INTEGER NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CLEARED',
    flags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_channel ON transactions(channel);

-- 7. THREAT INTELLIGENCE & GRAPH ENTITIES
CREATE TABLE threat_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_code VARCHAR(50) UNIQUE NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'DOMAIN', 'PHONE', 'MERCHANT', 'WALLET', 'CAMPAIGN'
    entity_value VARCHAR(255) NOT NULL,
    reputation_score INTEGER NOT NULL,
    campaign_name VARCHAR(255),
    reports_count INTEGER DEFAULT 1,
    estimated_impact_usd NUMERIC(14, 2) DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_threat_entities_val ON threat_entities(entity_value);
CREATE INDEX idx_threat_entities_type ON threat_entities(entity_type);

CREATE TABLE threat_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_entity_id UUID REFERENCES threat_entities(id) ON DELETE CASCADE,
    target_entity_id UUID REFERENCES threat_entities(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- 'sent', 'paid', 'visited', 'associated_with', 'routed_via'
    weight NUMERIC(4, 2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ALERTS & INCIDENT TRIAGE
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_code VARCHAR(50) UNIQUE NOT NULL,
    threat_entity_id UUID REFERENCES threat_entities(id),
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    entity_affected VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    is_cooldown_active BOOLEAN DEFAULT FALSE,
    assigned_analyst VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_sev ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);

-- 9. USER & ANALYST FEEDBACK LOOP
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_result_id UUID REFERENCES scan_results(id) ON DELETE CASCADE,
    feedback_type VARCHAR(50) NOT NULL, -- 'VALID_DETECTION', 'FALSE_POSITIVE', 'MISSED_INDICATOR'
    analyst_notes TEXT,
    is_reviewed_for_retraining BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SECURITY AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_code VARCHAR(50) UNIQUE NOT NULL,
    actor_identifier VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    signature_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_identifier);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
