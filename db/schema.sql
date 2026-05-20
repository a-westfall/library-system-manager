CREATE TABLE users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patron', 'librarian', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE library_cards (
    card_number TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    address TEXT NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE card_applications (
    application_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

CREATE TABLE books (
    isbn TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    publisher TEXT,
    date_published DATE
);

CREATE TABLE copies (
    barcode TEXT PRIMARY KEY,
    isbn TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'checked_out', 'lost')),
    FOREIGN KEY (isbn) REFERENCES books(isbn)
);

CREATE TABLE checkouts (
    checkout_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    barcode TEXT NOT NULL,
    checkout_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (barcode) REFERENCES copies(barcode)
);

CREATE TABLE holds (
    hold_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    isbn TEXT NOT NULL,
    date_placed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (isbn) REFERENCES books(isbn)
);

ALTER TABLE checkouts
ADD CONSTRAINT due_date_check CHECK (due_date - checkout_date = 21);
