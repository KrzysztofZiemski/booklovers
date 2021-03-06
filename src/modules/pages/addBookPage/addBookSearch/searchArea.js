import React from 'react';
import './SearchArea.scss';

export const SearchArea = props => {
    return (
        <div className="search-area">
            <form onSubmit={props.searchBook} action="">
                <input onChange={props.handleSearch} type="search" className="bookSearch" required/>
                {/*<button type="submit">Search</button>*/}
                {/*<select defaultValue="Sort" onChange={props.handleSort} name="" id="">*/}
                {/*    <option disabled value="Sort">Sort</option>*/}
                {/*    <option value="Newest">Newest</option>*/}
                {/*    <option value="Oldest">Oldest</option>*/}
                {/*</select>*/}
            </form>
        </div>
    );
};
