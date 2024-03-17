CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE palet (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    colors TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);
