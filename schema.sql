-- MOOD PALET BASE SCHEMA
-------------------------
-- user password is a famous painter

PRAGMA encoding='UTF-8';
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO user VALUES(1,'rené','scrypt:32768:8:1$8t88vGCg9rk8N5Ta$17ee17a4a390fb8603c9416c23ff44f4eaabc34b28fa12294fd300e47e209d096828fcff34ada08f7947052a44f1af2bae67847ca79a232f7fccf42ede8a20a1');


CREATE TABLE palet (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    colors TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

INSERT INTO palet VALUES(1,1,datetime('now'),'Red flowers and Vanilla','[[30, 25, 8], [191, 73, 39], [236, 216, 181], [89, 51, 17], [181, 158, 149]]','251f4953');
INSERT INTO palet VALUES(2,1,datetime('now'),'North Sea Shore November 1976','[[126, 157, 159], [31, 20, 15], [212, 187, 83], [145, 104, 31], [45, 126, 154]]','c88901bb');
INSERT INTO palet VALUES(3,1,datetime('now'),'Lego Bricks Test#1','[[204, 47, 138], [19, 163, 185], [199, 215, 16], [238, 92, 30], [174, 57, 209]]','96ea2b48');
INSERT INTO palet VALUES(4,1,datetime('now'),'Bottle of Beaujolais 🍷🍇','[[141, 138, 153], [38, 60, 65], [117, 46, 75], [225, 177, 178], [128, 89, 59]]','cc6b1ca6');
INSERT INTO palet VALUES(5,1,datetime('now'),'Landscape of Tunis during summer 1984','[[154, 98, 14], [63, 39, 16], [229, 211, 154], [137, 147, 138], [223, 156, 10]]','ccb88cd1');

COMMIT;
