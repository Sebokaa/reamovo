import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "react-fade-in";
import "./TvShows.css";

function TvShows() {
  const [tvs, setTvs] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState("");
  const [streamProviders, setStreamProviders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [cast, setCast] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [fadeInKey, setFadeInKey] = useState(0)

  const fetchTvShows = async (page) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}&api_key=713c33461007570ea56280951021d558`
    );
    const responseJSON = await response.json();
    console.log(responseJSON.results);
    setTvs(responseJSON.results);
    setPages(responseJSON.total_pages);
  };

  const fetchTvGenre = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/tv/${seriesID}?language=en-US&api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    setGenres(responseJSON.genres);
  };

  const fetchTvRating = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/tv/${seriesID}/content_ratings?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    responseJSON.results.forEach((result) => {
      if (result.iso_3166_1 === "US") {
        setRating(result.rating);
      }
    });
  };

  const fetchTvShowCast = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/tv/${seriesID}/aggregate_credits?language=en-US&api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    setCast(responseJSON.cast.slice(0, 5));
  };

  const fetchTvSeriesProvider = async (seriesID) => {
    const url = `https://api.themoviedb.org/3/tv/${seriesID}/watch/providers?api_key=713c33461007570ea56280951021d558`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    if (responseJSON.results.US.buy) {
      setProviders(responseJSON.results.US.buy);
    }
    if (responseJSON.results.US.flatrate) {
      setStreamProviders(responseJSON.results.US.flatrate);
    }
  };

  const fetchTrailer = async (seriesID) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/videos?language=en-US&api_key=713c33461007570ea56280951021d558`
    );
    const responseJSON = await response.json();
    responseJSON.results.forEach((trailer) => {
      if (trailer.type === "Trailer") {
        setTrailer(trailer.key);
        return;
      }
    });
  };

  const handlePageChangeUp = () => {
    if (currentPage < pages) {
      setFadeInKey((prev) => prev + 1)
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChangeDown = () => {
    if (currentPage > 1) {
      setFadeInKey((prev) => prev + 1)
      setCurrentPage(currentPage - 1);
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

  useEffect(() => {
    if (selectedShow) {
      fetchTvRating(selectedShow.id);
      fetchTvGenre(selectedShow.id);
      fetchTrailer(selectedShow.id);
      fetchTvShowCast(selectedShow.id);
      fetchTvSeriesProvider(selectedShow.id);
    }
  }, [selectedShow]);

  useEffect(() => {
    fetchTvShows(currentPage);
  }, [currentPage]);

  return (
    <FadeIn key={fadeInKey} transitionDuration={1000}>
      <div className="tvsContainer">
        <Navbar />
        <div className="bannerOverlay"></div>
        <div className="tvSideScroll">
          {tvs.map((tv) => (
            <div
              className="tvBannerContainer"
              key={tv.id}
              style={{
                background: `url("https://image.tmdb.org/t/p/w500${tv.backdrop_path}")`,
                backgroundSize: "cover",
              }}
            >
              <div className="tvBanner">
                <div className="bannerTitle">
                  <h1>{tv.name}</h1>
                </div>
                <div className="bannerInfo">
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
                      {tv.vote_average.toFixed(1)}
                    </p>
                  </div>
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
                      {tv.first_air_date.slice(0, 4)}
                    </p>
                  </div>
                  <span>·</span>
                  <div className="bannerAudience">
                    <svg
                      style={{ fontSize: "47px", marginRight: "7px" }}
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 640 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z"></path>
                    </svg>

                    <p style={{ fontSize: "20px" }}>
                      {tv.original_language.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="bannerDisc">
                  <h6>{tv.overview}</h6>
                </div>
                <div className="bannerButtons">
                  <button
                    onClick={() => {
                      openModal(tv);
                    }}
                    href=""
                  >
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
                        d="M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                        fill="currentColor"
                      ></path>
                    </svg>{" "}
                    More Info
                  </button>
                  <button href="">
                    <svg
                      style={{ fontSize: "24px" }}
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
                    </svg>{" "}
                    Watch List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="tvsTitleHeader">
          <h1>TV-Shows</h1>
        </div>
        <div className="tvContainer">
          {tvs.map((tv) => (
            <div
              className="tvshow"
              onClick={() => {
                openModal(tv);
              }}
              key={tv.id}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt=""
              />
              <div className="tvTags">
                <p>{tv.first_air_date.slice(0, 4)}</p>
                <p class="tvTag">TV-Show</p>
                <p>{`${tv.vote_average.toFixed(1)}/10`}</p>
              </div>
              <div className="tvHeader">{tv.name}</div>
            </div>
          ))}
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
        <div className="tvPages">
          <a
            onClick={() => handlePageChangeDown()}
            disabled={currentPage === 1}
            href="#"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
            </svg>
          </a>
          <a>{currentPage}</a>
          <a
            onClick={() => handlePageChangeUp()}
            disabled={currentPage === pages}
            href="#"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </a>
        </div>
        <Footer />
      </div>
    </FadeIn>
  );
}

export default TvShows;
