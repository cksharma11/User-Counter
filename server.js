const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = new express();
const PORT = process.env.PORT || 8080;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "counter"
});

connection.connect();

const logger = (req, res) => {
  console.log(req.url);
  req.next();
};

app.use(logger);
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  connection.query(`select * from counter;`, (error, data, fields) => {
    res.send(JSON.stringify(data));
  });
});

app.get("/userCount", (req, res) => {
  connection.query(`select count(*) as count from counter`, (error, data, field) => {
    res.send(data[0]);
  });
});

app.post("/addUser", (req, res) => {
  const username = req.body.username;
  connection.query(
    `insert into counter(name) values("${username}");`,
    (error, result) => {
      if (error) throw error;
      res.redirect("/");
    }
  );
});

app.listen(PORT, () => console.log("Listning on ", PORT));
