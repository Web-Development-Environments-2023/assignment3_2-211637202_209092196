SELECT * FROM mydb.users;

USE my_db;
INSERT INTO users (username, firstname, lastname, country, password, email)
VALUES ('jank', 'Jan', 'zaatra', 'israel', 'janz', 'jan@gmail.com');

SELECT * FROM my_db.users;

INSERT INTO FavoriteRecipes (user_id, recipe_id)
VALUES ('1', '716429')
