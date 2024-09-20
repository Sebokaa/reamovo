import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoPic from "../Assets/logoPic.png";
import Pfp from "../Assets/man.avif";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [searchedDataList, setSearchedDataList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState("");
  const [streamProviders, setStreamProviders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [cast, setCast] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const fetchMovieAndTvShows = async (searchItem) => {
    const url = `https://api.themoviedb.org/3/search/multi?query=${searchItem}&api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    const filteredResponseJSON = responseJSON.results?.filter(
      (item) => item.media_type !== "person"
    );
    console.log(responseJSON);
    setSearchedDataList(filteredResponseJSON);
  };

  const fetchTvGenre = async (mediaType, seriesID) => {
    const url = `https://api.themoviedb.org/3/${mediaType}/${seriesID}?language=en-US&api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    setGenres(responseJSON.genres);
  };

  const fetchTvRating = async (mediaType, seriesID) => {
    if(mediaType === "movie") {
      const url = `https://api.themoviedb.org/3/movie/${seriesID}/release_dates?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    responseJSON.results.forEach((result) => {
      if (result.iso_3166_1 === "US") {
        setRating(result.release_dates[0].certification);
      }
    });
    } else {
      const url = `https://api.themoviedb.org/3/${mediaType}/${seriesID}/content_ratings?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    responseJSON.results.forEach((result) => {
      if (result.iso_3166_1 === "US") {
        setRating(result.rating);
      }
    });
    }
  };

  const fetchTvShowCast = async (mediaType, seriesID) => {
    let url = "";
    if(mediaType === "movie") {
      url = `https://api.themoviedb.org/3/movie/${seriesID}/credits?language=en-US&api_key=713c33461007570ea56280951021d558`;
    } else {
      url = `https://api.themoviedb.org/3/tv/${seriesID}/aggregate_credits?language=en-US&api_key=713c33461007570ea56280951021d558`;
    }
    const response = await fetch(url);
    const responseJSON = await response.json();
    console.log(responseJSON)
    setCast(responseJSON.cast.slice(0, 5));
  };

  const fetchTvSeriesProvider = async (mediaType, seriesID) => {
    const url = `https://api.themoviedb.org/3/${mediaType}/${seriesID}/watch/providers?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    if (responseJSON.results?.US?.buy) {
      setProviders(responseJSON.results.US.buy);
    } else {}
    if (responseJSON.results?.US?.flatrate) {
      setStreamProviders(responseJSON.results.US.flatrate);
    }
  };

  const fetchTrailer = async (mediaType, seriesID) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${seriesID}/videos?language=en-US&api_key=713c33461007570ea56280951021d558`
    );
    const responseJSON = await response.json();
    responseJSON.results.forEach((trailer) => {
      if (trailer.type === "Trailer") {
        setTrailer(trailer.key);
        return;
      }
    });
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      console.log("Logged Out");
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (tv) => {
    setSelectedShow(tv);
    setIsDisplayed(true);
  };

  const closeModal = () => {
    setSelectedShow(null);
    setIsDisplayed(false);
    setTrailer(null);
    setRating("");
    setGenres([]);
    setCast([]);
    setProviders([]);
    setStreamProviders([]);
  };

  console.log(selectedShow);

  useEffect(() => {
    if (selectedShow) {
      fetchTvRating(selectedShow.media_type, selectedShow.id);
      fetchTvGenre(selectedShow.media_type, selectedShow.id);
      fetchTrailer(selectedShow.media_type, selectedShow.id);
      fetchTvShowCast(selectedShow.media_type, selectedShow.id);
      fetchTvSeriesProvider(selectedShow.media_type, selectedShow.id);
    }
  }, [selectedShow]);

  useEffect(() => {
    fetchMovieAndTvShows(search);
  }, [search]);
  
  return (
    <div className="Navbar">
      <div className="navContainer">
        <div className="logoContainer">
          <Link to="/">
            <img src={LogoPic} alt="Logo " />
          </Link>
          <input
            placeholder="Search Movie or TV-Show..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            style={{ display: searchedDataList.length > 0 ? "flex" : "none" }}
            className="searchItems"
          >
            {searchedDataList.slice(0, 5).map((movieOrShow) => (
              <div key={movieOrShow.id} onClick={() => {openModal(movieOrShow)}} className="searchMovieOrShowContainer">
                <div
                  style={{
                    background: movieOrShow.backdrop_path
                      ? `url(https://image.tmdb.org/t/p/w500${movieOrShow.backdrop_path})`
                      : `url(https://posters.movieposterdb.com/24_02/2024/12584954/l_twisters-movie-poster_a76b8a6c.jpg)`,
                    backgroundSize: "cover",
                  }}
                  className="backDropImage"
                ></div>
                <div className="backDropImageOverLay"></div>
                <div className="MovieOrShowList">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movieOrShow.poster_path}`}
                    style={{
                      width: "70px",
                      borderRadius: "5px",
                      boxShadow: "0px 0px 20px rgb(0, 0, 0)",
                    }}
                    alt="Poster"
                  />
                  <div style={{ overflow: "hidden" }} className="searchHeaders">
                    <h1
                      style={{
                        fontWeight: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textWrap: "nowrap",
                      }}
                    >
                      {movieOrShow.title || movieOrShow.name}
                    </h1>
                    <div style={{ color: "white" }} className="bannerInfo">
                      <div
                        style={{ display: "flex", alignItems: "center" }}
                        className="bannerRating"
                      >
                        <svg
                          style={{ fontSize: "35px", marginRight: "7px" }}
                          fill="#ffffff"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M13.646 10.237c-.057-.032-.16-.048-.313-.048v3.542c.201 0 .324-.041.371-.122s.07-.301.07-.66v-2.092c0-.244-.008-.4-.023-.469a.223.223 0 0 0-.105-.151zm3.499 1.182c-.082 0-.137.031-.162.091-.025.061-.037.214-.037.46v1.426c0 .237.014.389.041.456.029.066.086.1.168.1.086 0 .199-.035.225-.103.027-.069.039-.234.039-.495V11.97c0-.228-.014-.377-.043-.447-.032-.069-.147-.104-.231-.104z"></path>
                            <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM6.631 14.663H5.229V9.266h1.402v5.397zm4.822 0H10.23l-.006-3.643-.49 3.643h-.875L8.342 11.1l-.004 3.563H7.111V9.266H8.93c.051.327.107.71.166 1.15l.201 1.371.324-2.521h1.832v5.397zm3.664-1.601c0 .484-.027.808-.072.97a.728.728 0 0 1-.238.383.996.996 0 0 1-.422.193c-.166.037-.418.055-.754.055h-1.699V9.266h1.047c.678 0 1.07.031 1.309.093.24.062.422.164.545.306.125.142.203.3.234.475.031.174.051.516.051 1.026v1.896zm3.654.362c0 .324-.023.565-.066.723a.757.757 0 0 1-.309.413.947.947 0 0 1-.572.174c-.158 0-.365-.035-.502-.104a1.144 1.144 0 0 1-.377-.312l-.088.344h-1.262V9.266h1.35v1.755a1.09 1.09 0 0 1 .375-.289c.137-.064.344-.096.504-.096.186 0 .348.029.484.087a.716.716 0 0 1 .44.549c.016.1.023.313.023.638v1.514z"></path>
                          </g>
                        </svg>
                        <p style={{ fontSize: "20px" }}>
                          {movieOrShow.vote_average.toFixed(1)}
                        </p>
                      </div>
                      <span>·</span>
                      <h6 style={{ fontWeight: 800 }}>
                        {movieOrShow.media_type.toLowerCase() === "movie"
                          ? (movieOrShow.media_type.charAt(0).toUpperCase() + movieOrShow.media_type.slice(1,3))
                          : movieOrShow.media_type.charAt(0).toUpperCase() + movieOrShow.media_type.slice(1)}
                      </h6>
                      <span>·</span>
                      <div
                        className="bannerYear"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          style={{ fontSize: "29px", marginRight: "7px" }}
                          color="#ffffff"
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 448 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-96zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
                        </svg>
                        <p style={{ fontSize: "20px" }}>
                          {movieOrShow.first_air_date &&
                          movieOrShow.first_air_date.length >= 4
                            ? movieOrShow.first_air_date.slice(0, 4)
                            : movieOrShow.release_date &&
                              movieOrShow.release_date.length >= 4
                            ? movieOrShow.release_date.slice(0, 4)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="links">
          <Link to="/movies">
            <a href="">Movies</a>
          </Link>
          <Link to="/tv-shows">
            <a href="">TV-Shows</a>
          </Link>
          <a href="">Explore</a>
          <a href="">My Watch List</a>
          <a class="dashboard" href="">
            <img class="pfp" src={auth.currentUser?.photoURL ? auth.currentUser.photoURL : "https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt="pfp" /> Dashboard
          </a>
          <div onClick={() => {handleLogOut()}} className="dropdown">
            <p>Log Out</p>
          </div>
        </div>
      </div>
      {isDisplayed && selectedShow && (
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
                  background: `url(https://image.tmdb.org/t/p/w500${selectedShow.backdrop_path})`,
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
                  <h1>{selectedShow.name}</h1>
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
                <h1 style={{ marginBottom: "10px" }}>TV-Show Trailer</h1>
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

export default Navbar;
