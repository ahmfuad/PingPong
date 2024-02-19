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
app.use('/api/', require("./src/login"));
app.use('/api/', require("./src/logout"));
app.use('/api/', require("./src/getUser"));
app.use('/api/', require("./src/getProject"));
app.use('/api/', require("./src/chat"));
app.use('/api/', require("./src/blog"));
app.use('/api/', require("./src/comments"));
app.use('/api/', require("./src/folders"));
app.use('/api/', require("./src/files"));


app.listen(port, () => console.log(`Running on port ${port}`));