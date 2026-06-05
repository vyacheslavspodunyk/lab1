CREATE TABLE IF NOT EXISTS pass_logs (
    id INTEGER PRIMARY KEY,
    passId INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
    createdAt TEXT NOT NULL,
    FOREIGN KEY (passId) REFERENCES passes(id) ON DELETE CASCADE
);