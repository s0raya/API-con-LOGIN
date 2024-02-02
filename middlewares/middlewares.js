const jwt = require('jsonwebtoken');
const hashedSecret = require('../config/config.js');


function generateToken(user) {
    return jwt.sign({ user: user.id }, hashedSecret, {
        expiresIn: '1h',
    });
}
function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ mensaje: 'token no generado' });
    }
    jwt.verify(token, hashedSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'token invalido' });
        }
        req.user = decoded.user;
        next();
    });

}

/*function getCharacter(){
    const characterInput = document.getElementById('character');
    

    const nombrePersonaje = characterInput.value.toLocaleLowerCase();

    fetch (`http://localhost:3000/characters/${nombrePersonaje}`)
        .then(response => response.json())
        .then(data => {
            if(data){
                characterInfo.innerHTML=""
                const { name, status, species, gender, origin:{name: originName}, image} = data;
                characterInfo.innerHTML =`
                    <h2>${name}</h2>
                    <p>${status}</p>
                    <p>${species}</p>
                    <p>${gender}</p>
                    <p>${originName}</p>
                    <img src="${image} aly="${name}">
                `
            }else {
                characterInfo.innerHTML='personaje no encontrado'

            }
        })
    .catch(error => characterInfo.innerHTML = `<p>Imposible acceder al personaje</p>`)

}*/

module.exports = { generateToken, verifyToken };