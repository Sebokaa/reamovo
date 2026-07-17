import React, { useEffect, useState } from "react";
import { addToWatchlist } from "../Util/watchlist";
import Navbar from "./Navbar";
import "./Explore.css";
import Footer from "./Footer";

function Explore() {
    
    const [isInitial, setIsInitial] = useState(true);
    const [movieList, setMovieList] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [wordIndex, setWordIndex] = useState(0);
    const [movieAdded, setMovieAdded] = useState([]);

    const words = [
        "Movies",
        "Shows",
        "Anime",
        "Favorites",
        "Next Pick",
        "Obsession"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [word.length]);

    const getMovieRequest = async () => {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

        const response = await fetch(url);
        const reponseJson = await response.json();

        console.log(reponseJson.results);

        setMovieList(reponseJson.results);
        setSelectedMovie(reponseJson.results[2]);
    };

    useEffect(() => {
        getMovieRequest();
    }, []);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const sendPrompt = async () => {
        setIsInitial(false);
        const userPrompt = prompt;
        setLoading(true);
        setPrompt("");

        const response = await fetch("http://localhost:5050/recommendations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: userPrompt
            })
        });

        const data = await response.json();
        setRecommendations(data.recommendations);

        setSelectedMovie(data.recommendations[0]);

        setLoading(false);
    };

    const handleWatchlist = async (movie) => {
        try {
            setMovieAdded([...movieAdded, movie.id]);
            await addToWatchlist(movie);
        } catch (error) {
            console.error(error);
        }
    };

    const backdropImg = selectedMovie?.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
        : `https://posters.movieposterdb.com/24_02/2024/12584954/l_twisters-movie-poster_a76b8a6c.jpg`;
    return (
        <div className="fadeIn">
            <Navbar />
            <div className="exploreContainer">
                <center>
                    <h1 className="exploreTitle">
                        Discover Your{" "}
                        <span key={wordIndex} className="changingWord">
                            {words[wordIndex]}
                        </span>
                    </h1>
                </center>
                <center><h3 class="exploreSubTitle">Powered by Reamovo AI</h3></center>
                {isInitial ? (
                    <div className="exploreHome" style={{ backgroundImage: `url(${backdropImg})` }}>
                        <div className="exploreOverlay"></div>
                        <div className="exploreDescriptionsContainer">
                            <div className="exploreLeft">
                                <div className="exploreMovieTitle">
                                    <h1>{selectedMovie?.title || "Movie Title"}</h1>
                                </div>
                                <div className="exploreMovieDescription">
                                    <h6>{selectedMovie?.overview || "Movie Overview"}</h6>
                                </div>
                            </div>
                            <div className="exploreRight">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`}
                                    alt=""
                                />
                                <div className="exploreOptions">
                                    <button onClick={() => handleWatchlist(selectedMovie)}>
                                        {movieAdded.includes(selectedMovie?.id) ? (
                                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon fill="#43A047" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9"></polygon></svg>
                                        ) : (
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
                                            </svg>
                                        )
                                        }
                                        {" "} Watch List
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="exploreMovieContainers">
                            <div className="exploreMovieList">
                                {movieList.slice(0, 6).map((movie) => (
                                    <div
                                        className="exploreMovie"
                                        onClick={() => {
                                            handleMovieClick(movie);
                                        }}
                                        key={movie.id}
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt=""
                                        />
                                        <div className="exploreMovieTags">
                                            <p>{movie.release_date.slice(0, 4)}</p>
                                            <p class="exploreMovTag">MOV...</p>
                                            <p>{`${movie.vote_average.toFixed(1)}/10`}</p>
                                        </div>
                                        <div className="exploreMovieHeader">{movie.title}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                ) : loading ? (
                    <div className="exploreHome">

                        <div className="exploreOverlay"></div>

                        <div className="exploreDescriptionsContainer">

                            <div className="exploreLeft">

                                <div className="exploreMovieTitle">
                                    <div className="skeleton skeletonTitle"></div>
                                </div>

                                <div className="exploreMovieDescription">
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText"></div>
                                    <div className="skeleton skeletonText short"></div>
                                </div>

                                <div className="exploreOptions">
                                    <div className="skeleton skeletonButton"></div>
                                </div>

                            </div>

                            <div className="exploreRight">
                                <div className="skeleton skeletonPoster"></div>
                                <div className="exploreOptions">
                                    <div className="skeleton skeletonButton"></div>
                                </div>
                            </div>

                        </div>

                        <div className="exploreMovieContainers">

                            <div className="exploreMovieList">
                                {[...Array(6)].map((_, index) => (
                                    <div className="exploreMovie" key={index}>
                                        <div className="skeleton skeletonPoster"></div>
                                        <div className="skeleton skeletonTag"></div>
                                        <div className="skeleton skeletonMovieTitle"></div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                ) : (
                    <div className="exploreHome" style={{ backgroundImage: `url(${backdropImg})` }}>
                        <div className="exploreOverlay"></div>
                        <div className="exploreDescriptionsContainer">
                            <div className="exploreLeft">
                                <div className="exploreMovieTitle">
                                    <h1>{selectedMovie?.title || "Movie Title"}</h1>
                                </div>
                                <div className="exploreMovieDescription">
                                    <div className="exploreReasonBackground">
                                        <h6 className="changingWord">{selectedMovie?.reason || "Movie Reason"}</h6>
                                    </div>
                                    <br />
                                    <h6>{selectedMovie?.overview || "Movie Overview"}</h6>
                                </div>
                            </div>
                            <div className="exploreRight">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie?.poster}`}
                                    alt=""
                                />
                                <div className="exploreOptions">
                                    <button onClick={() => handleWatchlist(selectedMovie)}>
                                        {movieAdded.includes(selectedMovie?.id) ? (
                                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon fill="#43A047" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9"></polygon></svg>
                                        ) : (
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
                                            </svg>
                                        )
                                        }
                                        {" "} Watch List
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="exploreMovieContainers">
                            <div className="exploreMovieList">
                                {recommendations.slice(0, 6).map((movie) => (
                                    <div
                                        className="exploreMovie"
                                        onClick={() => {
                                            handleMovieClick(movie);
                                        }}
                                        key={movie.id}
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                            alt=""
                                        />
                                        <div className="exploreMovieTags">
                                            <p>{movie.release_date.slice(0, 4)}</p>
                                            <p class="exploreMovTag">MOV...</p>
                                            <p>{`${movie.rating.toFixed(1)}/10`}</p>
                                        </div>
                                        <div className="exploreMovieHeader">{movie.title}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )
                }
                <div className="exploreChatInput">

                    <input
                        type="text"
                        placeholder="Ask Reamovo AI for recommendations..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendPrompt();
                            }
                        }}
                    />

                    <button
                        className="exploreSendButton"
                        onClick={sendPrompt}
                    >
                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Explore;
