const express = require('express');
const router = express.Router();
const users = require('../data/users');
const { generateToken, verifyToken } = require('../middlewares/middlewares');
const axios = require('axios');

router.get('/', (req, res)=>{
    const token = req.session.token;
    if(req.session.token) {
        res.send(`
            <a href="/search">Search</a>
            <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
            </form>
        `)
        
    } else {
        const loginForm = `
        <form action="/login" method="post">
          <label for="username">Usuario:</label>
          <input type="text" id="username" name="username" required><br>
    
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required><br>
    
          <button type="submit">Iniciar sesión</button>
        </form>
        <a href="/search">Search</a>
      `;
      res.send(loginForm);
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/search');
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
});

router.get('/search', verifyToken, (req,res) => {
    res.send(`
        <label for="name">Buscar personaje:</label>
        <input type="text" id="name" name="name">
        <button onclick="location.href='/character/' + document.getElementById('name').value">Buscar</button>
        <a href="/">Home</a>
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
        </form>
    `)
});

router.get('/character', verifyToken, async (req,res) => {
    try {
        const response = await axios.get(url);
        const character = response.data.results
        ;
        res.json(character)
    } catch(error) {
        res.status(404).json({err: 'No se pudieron obtener los datos'})
    }
});

router.get('/character/:name', verifyToken, async (req,res) => {
    const characterName = req.params.name;
    const urlName = `https://rickandmortyapi.com/api/character/?name=${characterName}`
    try {
        const response = await axios.get(urlName);
        const {name, status, species, gender, origin: {name: originName}, image} = response.data.results[0];

        res.send(`
            <h2>${name}</h2>
            <p>${status}</p>
            <p>${species}</p>
            <p>${gender}</p>
            <p>${originName}</p>
            <img src="${image}" alt="${name}">
            <form action="/logout" method="post">
                <button type="submit">Cerrar sesion</button>
            </form>
            <a href="/search">Buscador</a>
        
        `)
    }catch(error) {
        res.status(404).json({err: 'No se pudo obtener el personaje'})
    }
})

router.post('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
}) 

module.exports = router;

