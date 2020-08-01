const express = require("express");
const mysql = require("mysql");

const routes = require("./routes/main");

const port = 8084;

/* DB CONFIG */
const db = mysql.createConnection({
  host: "127.0.0.1",
  port: 3307,
  user: "root",
  password: "root",
  database: "midterm",
});

// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

global.db = db;
/* DB CONFIG */

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

routes(app);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/*
create database midterm;
use midterm;

// CREATE TABLE books (id INT AUTO_INCREMENT, name VARCHAR(50), price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

CREATE TABLE food (id INT AUTO_INCREMENT, name VARCHAR(50), typical_values_per DECIMAL(5, 2) unsigned, typical_values_unit VARCHAR(50), calories VARCHAR(50), carbs VARCHAR(50), fat VARCHAR(50), protein VARCHAR(50), salt VARCHAR(50), sugar VARCHAR(50), PRIMARY KEY(id));

INSERT INTO books (name, price)VALUES('database book', 40.25),('Node.js book', 25.00), ('Express book', 31.99);

DELETE FROM books WHERE id = 1;

UPDATE books SET price = 34.50 WHERE id = 1;

SHOW TABLES;

DESCRIBE books;

*/