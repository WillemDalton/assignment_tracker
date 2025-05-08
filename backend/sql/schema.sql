DROP TABLE IF EXISTS assignments;

CREATE TABLE assignments(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    class TEXT NOT NULL,
    due_date BIGINT NOT NULL,
    session_id TEXT NOT NULL
);