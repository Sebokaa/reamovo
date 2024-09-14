import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const getMovieRequest = async () => {
    const url =
      "https://api.themoviedb.org/3/discover/movie?api_key=713c33461007570ea56280951021d558";

    const response = await fetch(url);
    const reponseJson = await response.json();

    setMovieList(reponseJson.results);
    setSelectedMovie(reponseJson.results[0]);
  };

  useEffect(() => {
    getMovieRequest();
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const backdropImg = selectedMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
    : `https://posters.movieposterdb.com/24_02/2024/12584954/l_twisters-movie-poster_a76b8a6c.jpg`;
  return (
    <div className="Home" style={{ backgroundImage: `url(${backdropImg})` }}>
      <Navbar />
      <div className="overlay"></div>
      <div className="descriptionsContainer">
        <div className="left">
          <div className="movieTitle">
            <h1>{selectedMovie?.title || "Movie Title"}</h1>
          </div>
          <div className="movieDescription">
            <h6>{selectedMovie?.overview || "Movie Overview"}</h6>
          </div>
        </div>
        <div className="options">
          <button href="">More Info</button>
          <button href="">Add To Watch List</button>
        </div>
      </div>
      <div className="movieContainers">
        <div className="movieList">
          {movieList.slice(0, 6).map((movie) => (
            <div
              className="movie"
              onClick={() => {
                handleMovieClick(movie);
              }}
              key={movie.id}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt=""
              />
              <div className="movieTags">
                <p>{movie.release_date.slice(0, 4)}</p>
                <p class="movTag">MOV...</p>
                <p>{`${movie.vote_average.toFixed(1)}/10`}</p>
              </div>
              <div className="movieHeader">{movie.title}</div>
            </div>
          ))}
          <Link style={{textDecoration: "none"}} to="/movies">
            <div className="movie showMore">
              <div className="arrow">
                <svg
                  className="arrow1"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 20 20"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <p>Show More</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
