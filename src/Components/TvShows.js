import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./TvShows.css";

function TvShows() {
  const [tvs, setTvs] = useState([]);
  const [pages, setPages] = useState(0);
  const [streamProviders, setStreamProviders] = useState([]);
  const [tvSeriesID, setTvSeriesID] = useState(null);
  const [trailer, setTrailer] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [cast, setCast] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShow, setSelectedShow] = useState(null); // New state for selected show

  const fetchTvShows = async (page) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}&api_key=713c33461007570ea56280951021d558`
    );
    const responseJSON = await response.json();
    console.log(responseJSON.results);
    setTvs(responseJSON.results);
    setPages(responseJSON.total_pages);
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
    setStreamProviders(responseJSON.results.US.buy);
  };

  const fetchTrailer = async (seriesID) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/videos?language=en-US&api_key=713c33461007570ea56280951021d558`
    );
    const responseJSON = await response.json();
    setTrailer(responseJSON.results[0].key);
  };

  const handlePageChangeUp = () => {
    if (currentPage < pages) setCurrentPage(currentPage + 1);
  };

  const handlePageChangeDown = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = (tv) => {
    setSelectedShow(tv);
    setIsDisplayed(true);
  };

  const closeModal = () => {
    setSelectedShow(null);
    setIsDisplayed(false);
  };

  const getGenreName = (genreID) => {
    let genreName = "";
    switch (genreID) {
      case 10759:
        genreName = "Action & Adventure";
        break;
      case 16:
        genreName = "Animation";
        break;
      case 35:
        genreName = "Comedy";
        break;
      case 80:
        genreName = "Crime";
        break;
      case 99:
        genreName = "Documentary";
        break;
      case 18:
        genreName = "Drama";
        break;
      case 10751:
        genreName = "Family";
        break;
      case 10762:
        genreName = "Kids";
        break;
      case 9648:
        genreName = "Mystery";
        break;
      case 10763:
        genreName = "News";
        break;
      case 10764:
        genreName = "Reality";
        break;
      case 10765:
        genreName = "Sci-Fi & Fantasy";
        break;
      case 10766:
        genreName = "Soap";
        break;
      case 10767:
        genreName = "Talk";
        break;
      case 10768:
        genreName = "War & Politics";
        break;
      case 37:
        genreName = "Western";
        break;
      default:
        genreName = "Unknown Genre";
    }
    return genreName;
  };

  useEffect(() => {
    if (selectedShow) {
      fetchTrailer(selectedShow.id);
      fetchTvShowCast(selectedShow.id);
      fetchTvSeriesProvider(selectedShow.id);
    }
  }, [selectedShow]);

  useEffect(() => {
    fetchTvShows(currentPage);
  }, [currentPage]);

  return (
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
                    style={{ fontSize: "31px", marginRight: "7px" }}
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
                  <p style={{ fontSize: "20px" }}>
                    {tv.adult ? "18+" : "All Ages"}
                  </p>
                </div>
              </div>
              <div className="bannerDisc">
                <h6>{tv.overview}</h6>
              </div>
              <div className="bannerButtons">
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
            ></div>
            <div className="mainTvModal">
              <h1>{selectedShow.name}</h1>
              <div className="tvGenre">
                <div className="tvGenreHeader">
                  <p>Genre: </p>
                </div>
                <div className="tvGenreList">
                  {selectedShow.genre_ids.map((genre) => (
                    <span>{getGenreName(genre)}</span>
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
              {/* <div className="tvStream">
                <div className="tvStreamHeader">
                  <p>Stream Providers:</p>
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
              </div> */}
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
    </div>
  );
}

export default TvShows;
