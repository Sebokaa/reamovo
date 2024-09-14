import React, { useEffect } from "react";
import Logo from "../Assets/logo.png";
import "./preloader.css";
import { preLoaderAnim } from "../Animation";

const Preloader = () => {

    useEffect(() => {
        preLoaderAnim();
    }, [])

  return (
    <div className="preloader">
      <div className="texts-container">
        <span>Welcome</span>
        <span>To</span>
        <span>
          <img src={Logo} alt="Reamovo Logo" />
        </span>
      </div>
    </div>
  );
};

export default Preloader;
