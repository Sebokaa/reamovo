import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./Components/Preloader";
import Home from "./Components/Home";
import Movie from "./Components/Movie";
import TvShows from "./Components/TvShows";

function App() {
  return (
    <div className="App">
      {/* <Preloader /> */}
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
