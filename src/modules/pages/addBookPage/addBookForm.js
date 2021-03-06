import React, { useEffect } from 'react';
import { Form, Input, Label } from 'semantic-ui-react';
import { ErrorMessage } from '../../ErrorMessage/ErrorMessage';
import ErrorField from './ErrorField';
import { ButtonBasic } from '../../Button/Button';
import './addBookPage.scss';
import { Select } from 'semantic-ui-react';
import { getGoogleBooksQuery } from './googleBookSearchAutocomplete';

import categories from '../../../utils/bookGeneres';
import { addBookUserMetadata } from '../../../repos/book';

const AddBookForm = props => {
    const { addBookForm, addBookSuccess, user } = props;

    let [isbn, setISBN] = React.useState('');
    let [title, setTitle] = React.useState('');
    let [authors, setAuthors] = React.useState('');
    let [publishedYear, setPublishedYear] = React.useState();
    let [imageUrl, setImageUrl] = React.useState('');
    let [description, setDescription] = React.useState('');

    let [errorISBN, setErrorISBN] = React.useState(null);
    let [errorTitle, setErrorTitle] = React.useState(null);
    let [errorAuthors, setErrorAuthors] = React.useState(null);
    let [errorPublishedYear, setErrorPublishedYear] = React.useState(null);
    let [errorImageUrl, setErrorImageUrl] = React.useState(null);
    let [errorDescription, setErrorDescription] = React.useState(null);

    let [submit, setSubmit] = React.useState(null);
    let [category, setCategory] = React.useState([]);
    console.log(category)
    useEffect(() => {
        if (addBookSuccess) {
            setISBN('');
            setTitle('');
            setAuthors('');
            setPublishedYear('');
            setImageUrl('');
            setDescription('');
        }
    }, [addBookSuccess]);
    const [searchResults, setSearchResult] = React.useState([]);
    const [showDropdown, setShowDropdoown] = React.useState(true);


    const validateISBN = () => {
        if (isbn !== '' && isbn.length !== 10 && isbn.length !== 13) return setErrorISBN(true);
        setErrorISBN(false);
    };
    const validateTitle = () => {
        if (title.length < 2) return setErrorTitle(true);
        setErrorTitle(false);
    };
    const validateAuthors = () => {
        if (authors.length < 2) return setErrorAuthors(true);
        setErrorAuthors(false);
    };

    const validatePublishedYear = () => {
        if (!publishedYear) return setErrorPublishedYear(true);
        if (publishedYear.length !== 4 && publishedYear < 1000) return setErrorPublishedYear(true);
        setErrorPublishedYear(false);
    };

    const validateImageURL = () => {
        if (!imageUrl) return setErrorImageUrl(false);
    };

    const validateDescription = () => {
        if (!description) return setErrorDescription(false);
    };


    const handleAddBook = e => {
        e.preventDefault();
        const book = { isbn, title, authors, publishedYear, category, imageUrl, description };
        console.log(book)
        if (!isbn || (isbn.length !== 10 && isbn.length !== 13) || title === '' || authors === '' || publishedYear === 0 || category.length < 1) {
            return setSubmit(false)
        }
        addBookForm(book);
        if (user) {
            addBookUserMetadata(isbn, {
                userId: user.id,
                userName: user.name,
                status: 'inlibrary',
                rating: ''
            });
        }


    };

    return (
        <form className="addBookForm" onSubmit={handleAddBook}>
            {submit === false ? <ErrorMessage message="wypełnij wszystkie wymagane pola" closeError={() => setSubmit(null)} /> : null}
            <Form.Field className={errorISBN ? 'errorElementRegistration' : null}>
                <Label className="itemLabel" htmlFor="formISBN">ISBN: </Label>
                <Input
                    type="number"
                    id="formISBN"
                    value={isbn}
                    onBlur={() => {
                        validateISBN();
                        setTimeout(() => {
                            setShowDropdoown(false);
                        }, 300);
                    }}
                    onChange={(e, data) => {
                        setISBN(data.value);
                        setShowDropdoown(true);
                        data.value.length > 8 && getGoogleBooksQuery('isbn', data.value)
                            .then(res => {
                                if (res.hasOwnProperty('items')) {
                                    setSearchResult(res.items);
                                } else setSearchResult([]);
                            });
                    }}
                />
                <div className="dropdownListContainer">
                    {showDropdown && isbn !== null && isbn.length > 9 ? searchResults.map((book, i) => {
                        return (<div className="dropdownItem" key={i}
                            onClick={() => {
                                setISBN(book.volumeInfo.hasOwnProperty('industryIdentifiers') ? book.volumeInfo.industryIdentifiers[0].identifier : null);
                                setTitle(book.volumeInfo.title);
                                setAuthors(book.volumeInfo.authors.join(', '));
                                setPublishedYear(book.volumeInfo.publishedDate.split('-')[0]);
                                setImageUrl(book.volumeInfo.hasOwnProperty('imageLinks') ? book.volumeInfo.imageLinks.thumbnail : '');
                                setShowDropdoown(false);
                            }}>{book.volumeInfo.title}</div>);
                    }) : ''}
                </div>
                <ErrorField
                    error={errorISBN}
                    message={'ISBN powinien mieć 10 lub 13 znaków'}
                />
            </Form.Field>
            <Form.Field className={errorTitle ? 'errorElementRegistration' : null}>
                <Label htmlFor="formTitle">Tytuł: </Label>
                <Input
                    type="text"
                    id="formTitle"
                    value={title}
                    onChange={(e, data) => {
                        setTitle(data.value);
                        setShowDropdoown(true);
                        data.value.length > 1 && getGoogleBooksQuery('title', data.value)
                            .then(res => {
                                if (res.hasOwnProperty('items')) {
                                    setSearchResult(res.items);
                                } else setSearchResult([]);
                            });
                    }}
                    onBlur={() => {
                        validateTitle();
                        setTimeout(() => {
                            setShowDropdoown(false);
                        }, 300);
                    }}
                />
                <div className="dropdownListContainer">
                    {showDropdown && title.length > 1 ? searchResults.map((book, i) => {
                        return (<div className="dropdownItem" key={i}
                            onClick={() => {
                                setISBN(book.volumeInfo.hasOwnProperty('industryIdentifiers') ? book.volumeInfo.industryIdentifiers[0].identifier : '');
                                setAuthors(book.volumeInfo.hasOwnProperty('authors') ? book.volumeInfo.authors.join(', ') : null);
                                setPublishedYear(book.volumeInfo.hasOwnProperty('publishedDate') ? book.volumeInfo.publishedDate.split('-')[0] : '');
                                setImageUrl(book.volumeInfo.hasOwnProperty('imageLinks') ? book.volumeInfo.imageLinks.thumbnail : '');
                                setTitle(book.volumeInfo.title);
                                setShowDropdoown(false);
                            }}>{book.volumeInfo.title}</div>);
                    }) : ''}
                </div>
                <ErrorField
                    error={errorTitle}
                    message={'Podaj poprawny tytuł książki'}
                />
            </Form.Field>
            <Form.Field className={errorAuthors ? 'errorElementRegistration' : null}>
                <Label htmlFor="formAuthors">Autorzy (po przecinku): </Label>
                <Input
                    type="text"
                    id="formAuthors"
                    onChange={(e, data) => setAuthors(data.value)}
                    onBlur={validateAuthors}
                    value={authors}
                />
                <ErrorField
                    error={errorAuthors}
                    message={'Podaj poprawnie autora/autorów'}
                />
            </Form.Field>
            <Form.Field
                className={errorPublishedYear ? 'errorElementRegistration' : null}
            >
                <Label htmlFor="publishedYear">Rok publikacji: </Label>
                <Input
                    type="number"
                    id="formPublishedYear"
                    onBlur={validatePublishedYear}
                    onChange={(e, data) => setPublishedYear(data.value)}
                    value={publishedYear}
                />
                <ErrorField
                    error={errorPublishedYear}
                    message={'Rok publikacji powinien mieć 4 cyfry'}
                />
            </Form.Field>
            <Form.Field
                className={errorDescription ? 'errorElementRegistration' : null}
            >
                <Label htmlFor="formCategory">Kategoria: </Label>
                <Select placeholder='select category' options={categories}
                    onChange={(e, data) => setCategory([data.value])} value={category[0]} />
            </Form.Field>

            <Form.Field className={errorImageUrl ? 'errorElementRegistration' : null}>
                <Label htmlFor="formImageURL">URL obrazka: </Label>
                <Input
                    type="url"
                    id="formImageURL"
                    value={imageUrl}
                    onChange={(e, data) => setImageUrl(data.value)}
                    onBlur={validateImageURL}
                />
                <ErrorField
                    error={errorImageUrl}
                    message={'Podaj poprawnie adres obrazka'}
                />
            </Form.Field>
            <Form.Field
                className={errorDescription ? 'errorElementRegistration' : null}
            >
                <Label htmlFor="formDescription">Opis: </Label>
                <Input
                    type="text"
                    id="formDescription"
                    onChange={(e, data) => setDescription(data.value)}
                    onBlur={validateDescription}
                    value={description}
                />
                <ErrorField
                    error={errorDescription}
                    message={'Podaj poprawnie opis książki'}
                />
            </Form.Field>

            <ButtonBasic content="Dodaj" handleClick={handleAddBook} />
        </form>
    );
};

export default AddBookForm;
