import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./Components/Preloader";
import Home from "./Components/Home";
import Movie from "./Components/Movie";
import TvShows from "./Components/TvShows";
import Login from "./Components/Login";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Explore from "./Components/Explore";

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
    const authenticate = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date(),
          });
        }
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
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/tv-shows" element={<TvShows />} />
          <Route path="/reamovo-ai" element={<Explore />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
