import React from "react";
import { Link } from "react-router-dom";
import LogoPic from "../Assets/logoPic.png";
import Pfp from "../Assets/man.avif";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="Navbar">
      <div className="navContainer">
        <div className="logoContainer">
          <Link to="/">
            <img src={LogoPic} alt="Logo " />
          </Link>
          <input placeholder="Search Movie..." type="text" />
        </div>{" "}
        <div className="links">
          <Link to="/movies">
            <a href="">Movies</a>
          </Link>
          <Link to="/tv-shows">
            <a href="">TV-Shows</a>
          </Link>
          <a href="">Explore</a>
          <a href="">My Watch List</a>
          <a href="">Pricing</a>
          <a class="dashboard" href="">
            <img class="pfp" src={Pfp} alt="pfp" /> Dashboard
          </a>
          <div className="dropdown">
            <p>Theme</p>
            <p>Setting</p>
            <p>Contact Us</p>
            <p>Log Out</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
