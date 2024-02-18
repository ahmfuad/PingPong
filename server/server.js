const express = require('express');
const authRoutes = require('./src/insertion/routes.js');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser());

app.use(express.static('files'));

const oneDay = 1000 * 60 * 60 * 24;
const sessionSecretKey = "PingPong";
app.use(session({
  secret: sessionSecretKey,
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false 
}));


app.get(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("PingPong");
})

app.use('/api/', authRoutes);
app.use(require("./src/login"));
app.use(require("./src/logout"));
app.use(require("./src/getUser"));
app.use(require("./src/getProject"));
app.use(require("./src/chat"));
app.use(require("./src/blog"));
app.use(require("./src/comments"));
app.use(require("./src/folders"));
app.use(require("./src/files"));


app.listen(port, () => console.log(`Running on port ${port}`));