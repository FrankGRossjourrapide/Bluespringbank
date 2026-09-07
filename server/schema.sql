CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Checking Account',
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  balance_cents BIGINT NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  pending_cents BIGINT NOT NULL DEFAULT 0 CHECK (pending_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'transfer')),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_sections (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('profile', 'preferences', 'kyc', 'cards', 'beneficiaries', 'statements')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, section)
);

CREATE INDEX IF NOT EXISTS transactions_account_created_idx ON transactions(account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);

INSERT INTO user_sections (user_id, section)
SELECT users.id, sections.section
FROM users
CROSS JOIN unnest(ARRAY['profile', 'preferences', 'kyc', 'cards', 'beneficiaries', 'statements']) AS sections(section)
ON CONFLICT (user_id, section) DO NOTHING;