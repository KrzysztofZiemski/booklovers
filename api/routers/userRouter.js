const express = require('express');
const userRouter = express.Router();
const {
    getAllUsersController,
    addUserController,
    getUserController,
    getUserSafeDetails,
    updateUserDetailsController,
    changeUserPasswordController,
    removeUserController,
    insertBookToBookshelf,
    getAllUserBooksController,
    deleteUserBookController,
    matchMatesController,
    addMateController,
    removeMateController
} = require('../controllers/user');
const { hashPassword } = require('../db/utils/passwordEncryption');
const { validateToken } = require('../db/utils/token');

const getAllUsers = (req, res) => {
    return getAllUsersController()
        .catch(err => {
            res.status(400).send(err);
        })
        .then(result => res.status(200).json(result));
};

const getUser = (req, res) => {
    return getUserController(req.params.id).then((response) => res.json(response));
};

const getUserDetails = (req, res) => {
    return getUserSafeDetails(req).then((response) => res.status(200).json(response));
};

const addUser = async (req, res) => {
    const user = req.body;
    if (!user.name || !user.mail || !user.password || !user.coords) return res.status(400).json('not enough information');
    const { salt, password } = await hashPassword(user);
    user.salt = salt;
    user.password = password;

    addUserController(user)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(e => res.status(500).json('invalid data'));
};

const setResultStatus = (result, res) => {
    if (result) {
        return res.status(204).end();
    } else {
        return res.status(404).end();
    }
};

const removeUser = (req, res) => {
    removeUserController(req.params.id)
        .then(result => setResultStatus(result, res))
        .catch(error => res.status(500).json(error));
};

const updateUser = (req, res) => {
    updateUserDetailsController(req.params.id, req.body)
        .then(result => setResultStatus(result, res))
        .catch(error => res.status(500).json(error));
};

const changeUserPassword = (req, res) => {
    changeUserPasswordController(req.params.id, req.body)
        .then(result => setResultStatus(result, res))
        .catch(error => res.status(500).json(error));
};

const addUserBookToBookshelf = async (req, res) => {
    const { book, userId } = req.body;

    try {
        let currentUserBooks = await getAllUserBooksController(userId);
        let bookArr = currentUserBooks.rows[0].bookdata || [];
        if (bookArr.map(b => b.bookId).indexOf(book.bookId) === -1) {
            await insertBookToBookshelf(book, userId);
            return res.status(200).json(bookArr);
        }
        throw new Error('book already exist in your library');
    } catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
};

const getAllUserBooks = (req, res) => {
    getAllUserBooksController(req.params.userId)
        .then(result => {
            if (result && result.hasOwnProperty('rows') && result.rows.length > 0) return res.json(result.rows[0].bookdata || []);
            res.json([]);
        }).catch(err => {
            res.status(400).send(err);
        });
};

const deleteUserBookFromBookShelf = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        let currentUserBooks = await getAllUserBooksController(userId);
        let bookArr = currentUserBooks.rows[0].bookdata || [];
        let booksToStay = bookArr.filter(b => b.bookId !== bookId);
        await deleteUserBookController(booksToStay, userId);
        let newBookArray = await currentUserBooks.rows[0].bookdata || [];
        return res.status(200).json(newBookArray);
    } catch (err) {
        return res.status(400).json(err);
    }
};

const matchMates = (req, res) => {
    const id = req.token.sub;
    matchMatesController(id)
        .then(mates => res.status(200).json(mates))
        .catch(err => res.status(500).json(err));
};

const getPublicUser = (req, res) => {
    const id = req.params.id;
    getUserController(id)
        .then(user => {
            if (user.length === 0) res.status(404).json('not find user');
            if (user.length > 1) res.status(400).json('bad request - matches more that one user');
            const { id, email, name, country, city, books, gender } = user[0];
            const publicData = { id, email, name, country, city, books, gender };
            res.status(200).json(publicData);
        })
        .catch(err => res.status(500).json('server problem'));
};

const addMate = (req, res) => {
    const id = req.token.sub;
    const mate = req.body;
    addMateController(id, mate)
        .then(response => {
            res.status(200).json('ok');
        })
        .catch(err => {
            if (err == 400) return res.status(400).json('mate exist in user list');
            res.status(500).json('err');
        });
};
const removeMate = (req, res) => {
    const id = req.token.sub;
    const idMate = req.params.idMate;
    removeMateController(id, Number(idMate))
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json(err));
};

//localhost:3010/user

userRouter.get('/details', validateToken, getUserDetails);
// userRouter.get('/match', validateToken, matchMates);
userRouter.get('/match', validateToken, matchMates);
userRouter.get('/public/:id', getPublicUser);
userRouter.get('/:id', validateToken, getUser);
userRouter.post('/', addUser);
userRouter.put('/books', addUserBookToBookshelf);
userRouter.put('/mate', validateToken, addMate);
userRouter.delete('/mate/:idMate', validateToken, removeMate);
userRouter.put('/:id', updateUser);
userRouter.put('/:id/password', changeUserPassword);
userRouter.delete('/:id', removeUser);
userRouter.get('/books/:userId', getAllUserBooks);
userRouter.delete('/books/:userId/:bookId', deleteUserBookFromBookShelf);
userRouter.get('/', getAllUsers);


module.exports = userRouter;
