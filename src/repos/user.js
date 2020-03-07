import { getCookies } from "../modules/cookies/cookies";
import { BACKEND_URL } from "../const";

const urlUser = `${BACKEND_URL}/user/`;
const urlAuth = `${BACKEND_URL}/auth/`;

export const getUser = (id) => {
    let accessToken = getCookies().accessToken;
    return fetch(`${urlUser}${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
};

export const addUser = (user) => {
    return fetch(urlUser, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
    })
};

export const updateUser = (id) => {
    //  return fetch(url, {})
};

export const removeUser = id => {
    //  return fetch(url, {})
};

export const auth = (data) => {
    return fetch(urlAuth, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            console.log(response)
            if (response.status === 200) return response.json();
            throw new Error();
        })
};

export const getUserDetails = (accessToken) => {
    return fetch(`${urlUser}details`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(data => data.json())
}

export const addBookToShelf = (book, id) => {
    return fetch(`${urlUser}books`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ book, userId: id })
    }).then(res => res.json())
}

export const getAllBooks = (id) => {
    return fetch(`${urlUser}books/${id}`)
        .then(res => {
            if (res.status !== 200) throw new Error(res.status);
            console.log(res)
            return res.json();
        })
}

export const deleteUserBook = (userId, bookId) => {
    console.log(bookId)
    return fetch(`${urlUser}books/${userId}`, {
        method: 'DELETE',
        body: JSON.stringify({ bookId }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
}