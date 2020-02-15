DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS interactionsEnum;
DROP TYPE IF EXISTS statusEnum;

CREATE TYPE interactionsEnum AS ENUM ('Mail', 'Courrier', 'Formulaire de contact', 'Rencontre', 'Téléphone');
CREATE TYPE statusEnum AS ENUM ('Refus', 'En attente', 'Promesse verbale', 'Contrat signé');

CREATE TABLE users (
    id serial PRIMARY KEY,
    mail TEXT,
    password TEXT,
    registerDate timestamp DEFAULT NOW()
);

CREATE TABLE companies (
    id serial PRIMARY KEY,
    user_id INTEGER references users(id),
    name TEXT,
    details TEXT
);

CREATE TABLE interactions (
    id serial PRIMARY KEY,
    company_id INTEGER references companies(id),
    date DATE,
    interaction interactionsEnum,
    detail TEXT,
    status statusEnum
);