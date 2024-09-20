import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import FadeIn from 'react-fade-in';
import "./Home.css";
import Footer from "./Footer";

function Home() {
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState("");
  const [streamProviders, setStreamProviders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [cast, setCast] = useState([]);
  const [selectMovie, setSelectMovie] = useState(null);

  const getMovieRequest = async () => {
    const url =
      "https://api.themoviedb.org/3/discover/movie?api_key=713c33461007570ea56280951021d558";

    const response = await fetch(url);
    const reponseJson = await response.json();

    setMovieList(reponseJson.results);
    setSelectedMovie(reponseJson.results[2]);
  };

  const fetchMovieGenre = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/movie/${seriesID}?language=en-US&api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    setGenres(responseJSON.genres);
  };

  const fetchMovieRating = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/movie/${seriesID}/release_dates?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    responseJSON.results.forEach((result) => {
      if (result.iso_3166_1 === "US") {
        setRating(result.release_dates[0].certification);
      }
    });
  };

  const fetchMovieShowCast = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/movie/${seriesID}/credits?language=en-US&api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    setCast(responseJSON.cast.slice(0, 5));
  };

  const fetchMovieSeriesProvider = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/movie/${seriesID}/watch/providers?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    if (Object.keys(responseJSON.results).length !== 0) {
      if (responseJSON.results.US.buy) {
        setProviders(responseJSON.results.US.buy);
      }
      if (responseJSON.results.US.flatrate) {
        setStreamProviders(responseJSON.results.US.flatrate);
      }
    }
  };

  const fetchMovieTrailer = async (seriesID) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${seriesID}/videos?language=en-US&api_key=713c33461007570ea56280951021d558`
    );
    const responseJSON = await response.json();
    responseJSON.results.forEach((trailer) => {
      if (trailer.type === "Trailer") {
        setTrailer(trailer.key);
        return;
      }
    });
  };

  const openModal = (movie) => {
    setSelectMovie(movie);
    setIsDisplayed(true);
  };

  const closeModal = () => {
    setSelectMovie(null);
    setIsDisplayed(false);
    setTrailer(null);
    setRating(null)
    setGenres([]);
    setCast([]);
    setProviders([]);
    setStreamProviders([]);
  };

  useEffect(() => {
    getMovieRequest();
  }, []);

  useEffect(() => {
    if (selectMovie) {
      fetchMovieRating(selectMovie.id);
      fetchMovieGenre(selectMovie.id);
      fetchMovieTrailer(selectMovie.id);
      fetchMovieShowCast(selectMovie.id);
      fetchMovieSeriesProvider(selectMovie.id);
    }
  }, [selectMovie])

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const backdropImg = selectedMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
    : `https://posters.movieposterdb.com/24_02/2024/12584954/l_twisters-movie-poster_a76b8a6c.jpg`;
  return (
    <FadeIn transitionDuration={2000}>
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
          <button onClick={() => {openModal(selectedMovie)}}href="">More Info</button>
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
          <Link style={{ textDecoration: "none" }} to="/movies">
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
      {isDisplayed && selectMovie && (
            <div className="moreInfoTvModal">
              <div
                onClick={() => {
                  closeModal();
                }}
                className="tvModalOverlay"
              ></div>
              <div className="tvModal">
                <div
                  className="modalImgContainer"
                  style={{
                    background: `url(https://image.tmdb.org/t/p/w500${selectMovie.backdrop_path})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="modalAddListButton">
                    <button href="">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mainTvModal">
                  <div className="mainTvModalHeader">
                    <h1>{selectMovie.title}</h1>
                    <div className="tvModalRating">
                      <svg
                        style={{
                          fontSize: "31px",
                          color: "grey",
                          marginRight: "7px",
                        }}
                        color="#ffffff"
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 100-6 3 3 0 000 6zm-5.784 6A2.238 2.238 0 015 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 005 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <p>{rating}</p>
                    </div>
                  </div>
                  <div className="tvGenre">
                    <div className="tvGenreHeader">
                      <p>Genre: </p>
                    </div>
                    <div className="tvGenreList">
                      {genres.map((genre) => (
                        <span>{genre.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="tvCast">
                    <div className="tvCastHeader">
                      <p>Cast: </p>
                    </div>
                    <div className="tvCastList">
                      {cast.map((castName) => (
                        <span>{castName.name}</span>
                      ))}
                      <span>...</span>
                    </div>
                  </div>
                  <div className="tvStream">
                    <div className="tvStreamHeader">
                      <p>Buy/Rent Providers:</p>
                    </div>
                    <div className="tvStreamList">
                      {providers.map((provider) => (
                        <span>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                            alt={provider.provider_name}
                          />{" "}
                          {provider.provider_name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="tvStream">
                    <div className="tvStreamHeader">
                      <p>Streaming Providers:</p>
                    </div>
                    <div className="tvStreamList">
                      {streamProviders.map((streaming) => (
                        <span>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${streaming.logo_path}`}
                            alt={streaming.provider_name}
                          />{" "}
                          {streaming.provider_name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tvTrailerModal">
                  <h1 style={{ marginBottom: "10px" }}>Movie Trailer</h1>
                  <div className="trailerVideo">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer}?rel=0`}
                      title="Youtube Video "
                      frameborder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
    </FadeIn>
  );
}

export default Home;
