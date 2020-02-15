const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const { Client } = require("pg");

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
  res.sendFile("index.html");
});
