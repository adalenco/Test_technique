`create user:`:
CREATE USER admin WITH PASSWORD 'admin'

`create tables:`
CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, CONSTRAINT email_unique UNIQUE (email));

CREATE TABLE resources (id SERIAL PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(100) NOT NULL, content VARCHAR(500) NOT NULL, created_at TIMESTAMPTZ NOT NULL, hit INT, CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id));

`grant permissions:`
GRANT ALL ON users TO admin;
GRANT ALL ON resources TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;
ALTER USER admin CREATEDB;
