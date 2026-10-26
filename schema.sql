-- ============================================================================
-- TakaTrack Production Database Schema (PostgreSQL / SQL Server Compatible)
-- Normalized relational schema with strict constraints, foreign keys, and indexes
-- ============================================================================

-- 1. Categories Master Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    color_hex VARCHAR(10) NOT NULL DEFAULT '#10B981',
    default_budget NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (default_budget >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial master categories
INSERT INTO categories (id, name, type, color_hex, default_budget) VALUES
('cat_rent', 'House Rent', 'expense', '#6366F1', 25000.00),
('cat_baby', 'Baby Care & Milk', 'expense', '#0EA5E9', 8000.00),
('cat_bike', 'Bike & Fuel', 'expense', '#F97316', 5000.00),
('cat_groc', 'Groceries', 'expense', '#10B981', 15000.00),
('cat_util', 'Utilities', 'expense', '#F59E0B', 6000.00),
('cat_hlth', 'Healthcare', 'expense', '#EF4444', 5000.00),
('cat_dine', 'Dining', 'expense', '#EC4899', 7500.00),
('cat_tran', 'Transport', 'expense', '#8B5CF6', 6500.00),
('cat_ent',  'Entertainment', 'expense', '#06B6D4', 4000.00),
('cat_pers', 'Personal', 'expense', '#14B8A6', 4000.00),
('cat_edu',  'Education', 'expense', '#3B82F6', 5000.00),
('cat_shop', 'Shopping', 'expense', '#F97316', 8000.00),
('cat_debt', 'Debt & Loan', 'expense', '#64748B', 10000.00),
('cat_misc', 'Miscellaneous', 'expense', '#94A3B8', 3000.00),
('cat_sal',  'Salary', 'income', '#10B981', 0.00),
('cat_free', 'Freelance', 'income', '#06B6D4', 0.00),
('cat_biz',  'Business', 'income', '#8B5CF6', 0.00),
('cat_inv',  'Investments', 'income', '#F59E0B', 0.00),
('cat_rent_inc', 'Rental Income', 'income', '#6366F1', 0.00),
('cat_gift', 'Bonus / Gifts', 'income', '#EC4899', 0.00),
('cat_oth',  'Other', 'income', '#94A3B8', 0.00)
ON CONFLICT (id) DO NOTHING;

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Cash', 'Card', 'bKash/Nagad', 'Bank Transfer', 'Mobile Wallet')),
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast queries, date ranges, and analytics filtering
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date_type ON transactions(date, type);

-- 3. Monthly Budgets Ceiling Table
CREATE TABLE IF NOT EXISTS monthly_budgets (
    id VARCHAR(64) PRIMARY KEY,
    month_year VARCHAR(7) NOT NULL UNIQUE, -- 'YYYY-MM'
    overall_target NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (overall_target >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month ON monthly_budgets(month_year);

-- 4. Category-Specific Monthly Budget Limits
CREATE TABLE IF NOT EXISTS category_budget_limits (
    id VARCHAR(64) PRIMARY KEY,
    month_year VARCHAR(7) NOT NULL REFERENCES monthly_budgets(month_year) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    limit_amount NUMERIC(14, 2) NOT NULL CHECK (limit_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_month_category UNIQUE (month_year, category_id)
);

CREATE INDEX IF NOT EXISTS idx_category_budget_month ON category_budget_limits(month_year);

-- 5. Materialized / Real-Time Summary View for Month-over-Month KPIs
CREATE OR REPLACE VIEW v_monthly_financial_kpis AS
SELECT
    TO_CHAR(t.date, 'YYYY-MM') AS month_year,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expenses,
    (COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) -
     COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)) AS net_savings,
    CASE
        WHEN COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) > 0 THEN
            ROUND((
                (COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) -
                 COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)) /
                COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 1)
            ) * 100, 2)
        ELSE 0.00
    END AS savings_rate_percentage,
    COUNT(t.id) AS total_transactions
FROM transactions t
GROUP BY TO_CHAR(t.date, 'YYYY-MM');
