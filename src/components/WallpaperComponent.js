import React, { useState, useEffect } from 'react';
import WallpaperData from './WallpaperData';
import stringSimilarity from 'string-similarity';
import './WallpaperComponent.css'; // Import the CSS file for styling

const WallpaperComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomPictures, setRandomPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    setLoading(true);

    const matchedCharacters = WallpaperData.flatMap((series) =>
      series.characters.filter((character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (matchedCharacters.length > 0) {
      const sortedCharacters = sortSearchResults(matchedCharacters);
      setSearchResults(sortedCharacters);
    } else {
      setSearchResults([]);
    }

    setLoading(false);
  };

  const sortSearchResults = (characters) => {
    const termLower = searchTerm.toLowerCase();
    const sortedCharacters = [...characters];

    sortedCharacters.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();

      if (aNameLower === termLower) {
        return -1; // Exact match should be at the top
      } else if (bNameLower === termLower) {
        return 1; // Exact match should be at the top
      } else {
        // Sort by string similarity score
        const aSimilarity = stringSimilarity.compareTwoStrings(aNameLower, termLower);
        const bSimilarity = stringSimilarity.compareTwoStrings(bNameLower, termLower);

        return bSimilarity - aSimilarity; // Higher similarity score comes first
      }
    });

    return sortedCharacters;
  };

  const getRandomAnimePictures = () => {
    const randomResults = [];

    WallpaperData.forEach((series) => {
      const randomCharacters = series.characters.sort(() => 0.5 - Math.random()).slice(0, 12); // Display 8 random characters
      randomResults.push(...randomCharacters);
    });

    return randomResults;
  };

  useEffect(() => {
    setRandomPictures(getRandomAnimePictures());
  }, []);

  const handleSearchButtonClick = () => {
    if (searchTerm.length >= 3) {
      handleSearch();
    }
  };

  return (
    <>
      <div className='home-background'>

      </div>
        <div className="wallpaper-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search series, genre, or character..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearchButtonClick}>Search</button>
          </div>

          {loading && <p>Loading...</p>}

          {searchTerm.length >= 3 && searchResults.length === 0 && (
            <h3>{searchTerm} not found. Showing random wallpapers.</h3>
          )}

          {searchResults.length > 0 && !loading && (
            <div className="image-container">
              {searchResults.map((character, index) => (
                <div className="image-item" key={index}>
                  <img src={character.img} alt={character.name} />
                  <div className="image-overlay">
                    <h4>{character.name}</h4>
                    <p>{character.series}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {randomPictures.length > 0 && (
            <div className="image-container">
              {randomPictures.map((character, index) => (
                <div className="image-item" key={index}>
                  <img src={character.img} alt={character.name} />
                  <div className="image-overlay">
                    <h4>{character.name}</h4>
                    <p>{character.series}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
};

export default WallpaperComponent;
