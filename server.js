const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const session = require("express-session");
const cors = require("cors");
const { Client } = require("pg");

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "jobstalkersessiontoken",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "jobstalker",
  password: "19Fe2502f52/",
  port: 5432
});
client.connect();

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/auth", (req, res) => {
  if (req.session.userID == undefined) {
    res.render("auth.ejs");
  } else {
    res.render("main.ejs");
  }
});
app.post("/register", urlencodedParser, (req, res) => {
  console.log(req.body.mail);
  console.log(req.body.password);
  console.log(req.body.confirmPassword);
  client.query(
    "SELECT * FROM users WHERE mail = $1",
    [req.body.mail],
    (err, res) => {
      if (res.rows.length == 0) {
        console.log("aucun mail");
        if (req.body.password == req.body.confirmPassword) {
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            client.query(
              "INSERT INTO users (mail, password) VALUES ($1, $2)",
              [req.body.mail, hash],
              (err, rows) => {
                if (err) {
                  console.log("erreur : " + err);
                }
                console.log("c'est bon");
              }
            );
          });
        } else {
          console.log("pas les mêmes mot de passe");
        }
      } else {
        console.log("mail déjà utilisé");
      }
    }
  );
  res.redirect("/auth");
});
app.post("/login", urlencodedParser, (req, res) => {
  console.log(req.body.mail);
  console.log(req.body.password);
  client.query(
    "SELECT * FROM users WHERE mail = $1",
    [req.body.mail],
    (err, res) => {
      if (res.rows[0] != undefined) {
        bcrypt.compare(req.body.password, rows[0].password, (err, result) => {
          console.log(result);
        });
      } else {
        console.log("Aucun compte lié à cet email");
      }
    }
  );
  res.redirect("/auth");
});

app.listen(3000);
