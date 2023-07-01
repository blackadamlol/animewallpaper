import React, { useState, useEffect } from 'react';
import WallpaperData from './WallpaperData';
import stringSimilarity from 'string-similarity';

const WallpaperComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomPictures, setRandomPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const randomResults = getRandomAnimePictures();
    setRandomPictures(randomResults);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 3) {
      const filteredResults = WallpaperData.filter((series) => {
        const matchingCharacters = series.characters.filter((character) =>
          character.name.toLowerCase().includes(term.toLowerCase())
        );

        return (
          series.series.toLowerCase().includes(term.toLowerCase()) ||
          series.genre.toLowerCase().includes(term.toLowerCase()) ||
          matchingCharacters.length > 0
        );
      });

      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = () => {
    setLoading(true);

    const matchedSeries = WallpaperData.filter((series) =>
      series.series.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedSeries.length > 0) {
      setSearchResults(matchedSeries);
      setLoading(false);
    } else {
      const fuzzyMatchedSeries = WallpaperData.filter((series) => {
        const similarity = stringSimilarity.compareTwoStrings(
          searchTerm.toLowerCase(),
          series.series.toLowerCase()
        );
        return similarity > 0.7; // Adjust the similarity threshold as needed
      });

      setSearchResults(fuzzyMatchedSeries);
      setLoading(false);
    }
  };

  const getRandomAnimePictures = () => {
    const randomSeries = WallpaperData.sort(() => 0.5 - Math.random()).slice(0, 5);
    const randomResults = randomSeries.flatMap((series) => series.characters);
    return randomResults;
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search series, genre, or character..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {searchResults.length > 0 && !loading && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.map((series, index) => (
            <div key={index}>
              {series.characters.map((character, i) => (
                <div key={i}>
                  <h3>{character.name}</h3>
                  <img src={character.img} alt={character.name} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {!searchResults.length > 0 && !loading && (
        <div>
          {randomPictures.map((character, index) => (
            <div key={index}>
              <h3>{character.name}</h3>
              <img src={character.img} alt={character.name} />
            </div>
          ))}
        </div>
      )}
        {searchResults.length === 0 && !loading && searchTerm.length >= 3 && (
        <p>Search not found.</p>
        )}
    </div>
  );
};

export default WallpaperComponent;
