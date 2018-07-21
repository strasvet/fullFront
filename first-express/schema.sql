DROP DATABASE IF EXISTS albums;
CREATE DATABASE albums;
USE albums;

CREATE TABLE albums(
    album_id INT PRIMARY KEY AUTO_INCREMENT,
    album_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE photos(
    album_id INT NOT NULL REFERENCES albums(album_id),
    photo_filename VARCHAR(100) NOT NULL UNIQUE
);

INSERT albums (album_name) VALUES ("Pruhonice"), ("Prague");

INSERT photos VALUES (1, "1.jpg"), (1,"2.jpg"),(1, "3.jpg"), (2,"4.jpg"), (2, "5.jpg");