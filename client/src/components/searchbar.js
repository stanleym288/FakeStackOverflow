import React, { useState } from 'react';

function SearchBar({onSearch}) {
    const [searchString, setSearchString] = useState('');
    const handleSearchChange = (event) => {
        setSearchString(event.target.value);
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            onSearch(searchString)
            setSearchString('');
        }
    };

    return (
        <div className="search-bar">
            <input 
            type="text" 
            placeholder='Search...'
            value = {searchString}
            onChange = {handleSearchChange}
            onKeyDown = {handleEnter}
            />
        </div>
    );
}

export default SearchBar;