const express = require('express');
const authRouter = express.Router();
const { checkPassword } = require('../db/utils/passwordEncryption');
const { getUserByMailController } = require('../controllers/user');
const { generateToken } = require('../db/utils/token');


const login = async (req, res) => {
    const userData = req.body;
    const responseUser = await getUserByMailController(userData);
    if (responseUser.length === 0) return res.status(404).json('nie znaleźliśmy takiego użytkownika');
    const user = responseUser[0];
    const isOk = await checkPassword(user, userData.password);
    if (!isOk) return res.status(401).json('błąd logowania');
    const token = generateToken(user);

    const { password_salt, password_hash, ...safeUserData } = user;
    const data = { ...safeUserData, token };

    return res.status(200).json(data);
};

//localhost:3010/auth

//logowanie i zwracanie Bearer tokena przy poprawnym logowaniu
authRouter.post('/', login);

//sprawdzanie poprawności Bearer tokena(token wysyłamy w headersach )
//authRouter.get('/token', validateToken, checkToken);

module.exports = authRouter;
