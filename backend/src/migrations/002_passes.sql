CREATE TABLE IF NOT EXISTS passes (
    id INTEGER PRIMARY KEY,
    userName TEXT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('study', 'work', 'repair', 'other')),
    date TEXT NOT NULL,
    comment TEXT,
    issuer TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT
);