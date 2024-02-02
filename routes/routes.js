const express = require('express');
const router = express.Router();
const users = require('../data/users');
const { generateToken, verifyToken } = require('../middlewares/middlewares');

router.get('/', (req, res)=>{

    /*if(req.session.token) {
        res.send(`
            <a href="/search">Search</a>
            <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
            </form>
        `)
        
    } else {*/
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
);

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/character');
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
});

router.get('/search', verifyToken, (req,res) => {
    res.send(`
    <form action="/character" method="get">
    <label for="character">Buscar personaje:</label>
    <input type="text" id="character" name="character">
    <buton type="submit" >Mostrar todos los personajes</button>
    </form>
    
    <button type="submit" onclick="getCharacter()">Buscar</button>
    `)
    res.redirect('/character');
});

router.get('/character',verifyToken, async (req,res) => {
    const characterName = req.query.name;
    const url = `https://rickandmortyapi.com/api/character`
    try {
        const response = await axios.get(url);
        const character = response.data.results;
        console.log(character);
        res.json(character)
        req.redirect('/:name')

    } catch(error) {
        res.status(404).json({err: 'No se pudieron obtener los datos'})
    }
});

router.get('/:name', async (req,res) => {
    const {name, status, species, gender, origin: {name: originName}, image} = character;
    res.send(`
    <h2>${name}</h2>
    <p>${status}</p>
    <p>${species}</p>
    <p>${gender}</p>
    <p>${originName}</p>
    <img src="${image} aly="${name}">
    
    `)
})

router.post('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
}) 

module.exports = router;

