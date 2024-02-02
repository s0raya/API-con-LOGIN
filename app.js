const express = require('express');
const app = express();
const session = require('express-session');
const routes = require('./routes/routes.js');

const hashedSecret = require('./config/config.js')

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: hashedSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
);

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Express está escuchando en http://localhost:${PORT}`);
})