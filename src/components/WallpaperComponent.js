import React, { useState, useEffect } from 'react';
import WallpaperData from './WallpaperData';
import stringSimilarity from 'string-similarity';

const WallpaperComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomPictures, setRandomPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 3) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  };

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
      const randomCharacters = series.characters.sort(() => 0.5 - Math.random()).slice(0, 5); // Display 5 random characters
      randomResults.push(...randomCharacters);
    });
  
    return randomResults;
  };
  

  useEffect(() => {
    setRandomPictures(getRandomAnimePictures());
  }, []);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search series, genre, or character..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading && <p>Loading...</p>}

      {searchResults.length > 0 && !loading ? (
        <div>
          {searchResults.map((character, index) => (
            <div key={index}>
              <img src={character.img} alt={character.name} />
            </div>
          ))}
        </div>
      ) : randomPictures.length > 0 ? (
        <div>
          {randomPictures.map((character, index) => (
            <div key={index}>
              <img src={character.img} alt={character.name} />
            </div>
          ))}
        </div>
      ) : (
        <p>No search results found. Showing random wallpapers.</p>
      )}
    </div>
  );
};

export default WallpaperComponent;
