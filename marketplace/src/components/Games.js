import React from 'react';

const Games = () => {
  return (
    <div className="page-content">
      <h1>Games</h1>
      <p>Play our exciting game below:</p>
      <iframe
        src="https://example-game.com" // Replace with your game's URL
        title="Game"
      ></iframe>
    </div>
  );
};

export default Games;