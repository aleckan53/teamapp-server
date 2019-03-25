DROP TABLE IF EXISTS user_projects;
CREATE TABLE user_projects (
  user_id INTEGER REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id)
);

DROP TYPE IF EXISTS role_type;

CREATE TYPE role_type AS ENUM (
  '1', '2' 
);

ALTER TABLE user_projects
  ADD COLUMN 
    role role_type;
    