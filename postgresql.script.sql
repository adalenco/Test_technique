-- Script SQL pour créer un utilisateur, une base de données et des tables, puis accorder des permissions

-- Créer l'utilisateur admin avec le mot de passe admin
CREATE USER admin WITH PASSWORD 'admin';

-- Créer la base de données test_technique
CREATE DATABASE test_technique;

-- Utiliser la base de données test_technique
\c test_technique;

-- Créer la table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT email_unique UNIQUE (email)
);

-- Créer la table resources
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hit INT,
    CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Accorder toutes les permissions sur la table users à l'utilisateur admin
GRANT ALL ON users TO admin;

-- Accorder toutes les permissions sur la table resources à l'utilisateur admin
GRANT ALL ON resources TO admin;

-- Accorder les permissions d'utilisation et de sélection sur toutes les séquences dans le schéma public à l'utilisateur admin
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Autoriser l'utilisateur admin à créer des bases de données
ALTER USER admin CREATEDB;