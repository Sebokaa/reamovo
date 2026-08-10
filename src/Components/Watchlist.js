import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { fetchWatchList } from "../Util/watchlist";
import "./Watchlist.css";

const TMDB_BASE = "https://api.themoviedb.org/3";
const FALLBACK_BACKGROUND = "https://posters.movieposterdb.com/24_02/2024/12584954/l_twisters-movie-poster_a76b8a6c.jpg";

function Watchlist() {
  const [movieList, setMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalMovie, setModalMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState("");
  const [providers, setProviders] = useState([]);
  const [streamProviders, setStreamProviders] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const authenticate = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const watchlistData = await fetchWatchList();
        fetchMoviesAndShows(watchlistData);
      } else {
        // router.push("/movies");
        console.log("User is not authenticated. Redirecting to /movies.");
      }
    })
    return () => authenticate()
  }, [])

  useEffect(() => {
    if (!modalMovie) return;
    fetchMovieDetails(modalMovie.id);
    fetchMovieRating(modalMovie.id);
    fetchMovieCast(modalMovie.id);
    fetchMovieProviders(modalMovie.id);
    fetchMovieTrailer(modalMovie.id);
  }, [modalMovie]);

  const fetchMoviesAndShows = async (movieIds) => {
    for (const movieId of movieIds) {
      if (movieId.startsWith("movie")) {
        const response = await fetch(
          `${TMDB_BASE}/movie/${movieId.replace("movie", "")}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const data = await response.json();
        setMovieList((prevList) => [...prevList, data]);
      } else if (movieId.startsWith("show")) {
        const response = await fetch(
          `${TMDB_BASE}/tv/${movieId.replace("show", "")}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const data = await response.json();
        setMovieList((prevList) => [...prevList, data]);
      }
    }
  };

  const fetchMovieDetails = async (movieId) => {
    const response = await fetch(`${TMDB_BASE}/movie/${movieId}?language=en-US&api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
    const data = await response.json();
    setGenres(data.genres || []);
  };

  const fetchMovieRating = async (movieId) => {
    const response = await fetch(`${TMDB_BASE}/movie/${movieId}/release_dates?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
    const data = await response.json();
    const usResult = data.results?.find((item) => item.iso_3166_1 === "US");
    setRating(usResult?.release_dates?.[0]?.certification || "PG");
  };

  const fetchMovieCast = async (movieId) => {
    const response = await fetch(`${TMDB_BASE}/movie/${movieId}/credits?language=en-US&api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
    const data = await response.json();
    setCast(data.cast?.slice(0, 5) || []);
  };

  const fetchMovieProviders = async (movieId) => {
    const response = await fetch(`${TMDB_BASE}/movie/${movieId}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
    const data = await response.json();
    const usData = data.results?.US || {};
    setProviders(usData.buy || []);
    setStreamProviders(usData.flatrate || []);
  };

  const fetchMovieTrailer = async (movieId) => {
    const response = await fetch(`${TMDB_BASE}/movie/${movieId}/videos?language=en-US&api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
    const data = await response.json();
    const trailerItem = data.results?.find((item) => item.type === "Trailer");
    setTrailer(trailerItem?.key || "");
  };

  const openModal = (movie) => {
    setModalMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMovie(null);
    setGenres([]);
    setRating("");
    setProviders([]);
    setStreamProviders([]);
    setCast([]);
    setTrailer("");
  };

  const backdropImg = selectedMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
    : FALLBACK_BACKGROUND;

  return (
    <div className="watchlist-page fadeIn">
      <div className="watchlist-hero" style={{ backgroundImage: `url(${backdropImg})` }}>
        <Navbar />
        <div className="watchlist-hero__overlay" />

        <div className="watchlist-hero__content">
          <div className="watchlist-hero__main">
            <h1 className="watchlist-hero__title">{selectedMovie?.title || "Featured Movie"}</h1>
            <p className="watchlist-hero__description">
              {selectedMovie?.overview || "Explore popular movies and open the modal for more details."}
            </p>
          </div>

          <div className="watchlist-hero__aside">
            <button className="watchlist-button" onClick={() => openModal(selectedMovie)}>
              More Info
            </button>
          </div>
        </div>
      </div>

      <div className="watchlist-grid">
        {movieList.map((movie) => (
          <div
            key={movie.id}
            className="watchlist-card"
            onClick={() => setSelectedMovie(movie)}
          >
            <img
              className="watchlist-card__poster"
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : FALLBACK_BACKGROUND}
              alt={movie.title}
            />
            <div className="watchlist-card__tags">
              <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
              <span className="watchlist-card__label">Movie</span>
              <span>{movie.vote_average?.toFixed(1) || "0.0"}/10</span>
            </div>
            <div className="watchlist-card__title">{movie.title}</div>
          </div>
        ))}
      </div>

      {isModalOpen && modalMovie && (
        <div className="moreInfoTvModal">
          <div
            onClick={() => {
              closeModal();
            }}
            className="tvModalOverlay"
          >
          </div>
          <div className="tvModal">
            <div
              className="modalImgContainer"
              style={{
                background: `url(https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path})`,
                backgroundSize: "cover",
              }}
            >
              <div className="modalAddListButton">
              </div>
            </div>
            <div className="mainTvModal">
              <div className="mainTvModalHeader">
                <h1>{selectedMovie.title}</h1>
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
                  {genres.map((genre, index) => (
                    <span key={index}>{genre.name}</span>
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
  );
}

export default Watchlist;
