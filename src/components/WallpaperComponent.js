import React, { useState, useEffect } from 'react';
import WallpaperData from './WallpaperData';
import stringSimilarity from 'string-similarity';
import './WallpaperComponent.css';

const WallpaperComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [randomPictures, setRandomPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    handleSearch();
    setRandomPictures(getRandomAnimePictures());
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

    const matchedSeries = WallpaperData.filter((series) =>
      series.series.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedSeries.length > 0) {
      const seriesCharacters = matchedSeries.flatMap((series) => series.characters);
      const sortedCharacters = sortSearchResults(seriesCharacters);
      setSearchResults(sortedCharacters);
    } else {
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
        return -1;
      } else if (bNameLower === termLower) {
        return 1;
      } else {
        const aSimilarity = stringSimilarity.compareTwoStrings(aNameLower, termLower);
        const bSimilarity = stringSimilarity.compareTwoStrings(bNameLower, termLower);

        return bSimilarity - aSimilarity;
      }
    });

    return sortedCharacters;
  };

  const getRandomAnimePictures = () => {
    const randomResults = [];

    WallpaperData.forEach((series) => {
      randomResults.push(...series.characters.sort(() => 0.5 - Math.random()));
    });

    return randomResults;
  };

  const handleSearchButtonClick = () => {
    if (searchTerm.length >= 3) {
      handleSearch();
    }
  };

  const handleDownloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'wallpaper';
    link.click();
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleLoadMore = () => {
    console.log("Load more clicked");
    setRandomPictures((prevRandomPictures) => {
      const newRandomPictures = getRandomAnimePictures();
      console.log("New random pictures:", newRandomPictures);
      return [...prevRandomPictures, ...newRandomPictures];
    });
  };

  return (
    <>
      <div className="top-image"></div>
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

        <div className="image-container">
          {(searchResults.length > 0 ? searchResults : randomPictures).map((character, index) => (
            <div className="image-item" key={index}>
              <img
                src={character.img}
                alt={character.name}
                onClick={() => handleViewImage(character.img)}
              />
              <div className="image-overlay">
                <h4>{character.name}</h4>
                <p>{character.series}</p>
                <button
                  className="download-button"
                  onClick={() => handleDownloadImage(character.img)}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="load-more-button-container">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load More Images
          </button>
        </div>

        {selectedImage && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>&times;</span>
              <img src={selectedImage} alt="Full View" className="full-view-image" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WallpaperComponent;
