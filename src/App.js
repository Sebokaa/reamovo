import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./Components/Preloader";
import Home from "./Components/Home";
import Movie from "./Components/Movie";
import TvShows from "./Components/TvShows";
import Login from "./Components/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const hasSeenPreloader = localStorage.getItem("hasSeenPreloader");
      if (hasSeenPreloader) {
        setShowPreloader(false);
      } else {
        localStorage.setItem("hasSeenPreloader", "true");
      }
    },
    []);

    useEffect(() => {
      const authenticate = onAuthStateChanged(auth, (user) => {
        if(user) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      })
      return () => authenticate()
    }, [])

  return (
    <div className="App">
      {/* {showPreloader && <Preloader />} */}
      {!isAuthenticated && <Login />}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/tv-shows" element={<TvShows />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
