import React from 'react';
import { BookCard } from './bookCard';

export const BookList = ({ id, books }) => {

    const handleSubmit = ({ title, imageLinks, authors, industryIdentifiers }) => {
        fetch('http://localhost:3010/user/books', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                book: {
                    bookId: industryIdentifiers[0].identifier,
                    title,
                    imageUrl: imageLinks.thumbnail,
                    authors: authors.join(', ')
                },
                userId: id
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err)
            );
    };

    return (
        <div className="list">
            {books.map((book, i) => (
                <BookCard key={i} image={book.imageLinks.thumbnail} title={book.title}
                          author={book.authors.join(', ')}
                          published={book.publishedDate} handleSubmit={() => handleSubmit(book)}/>
            ))}
        </div>
    );
};
