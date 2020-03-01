import React, { useEffect, useState } from 'react';
import { UserBookCard } from './userBookCard';

export const UserBookList = ({ id }) => {
    let [userBooks, setUserBooks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3010/user/books/${id}`)
            .then(res => {
                if (res.status !== 200) throw new Error(res.status);
                return res.json();
            })
            .then(res => setUserBooks(res))
            .catch(err => console.log(err));
    }, []);

    const handleBookDelete = (userBookId) => {
        fetch(`http://localhost:3010/user/books/${userBookId}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err)
            );
    };

    return (
        <div className="list">
            {userBooks.map((book, i) => (
                <UserBookCard key={i} userBookId={i} image={book.imageUrl} title={book.title}
                              author={book.authors} handleBookDelete={() => handleBookDelete(i + 1)}/>
            ))}
        </div>
    );
};


