const express = require('express');
const authRoutes = require('./src/authentication/routes.js');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.get(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("PingPong");
})

app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Running on port ${port}`));