import React, { useEffect, useRef } from "react";
import "./NavigateFooter.css";
import { AiFillHome } from "react-icons/ai";
import { FaPlay, FaPlus, FaUser } from "react-icons/fa";
import logo from "../../img/icon.png";
import { Link } from "react-router-dom";

const NavigateFooter = () => {
  const popupRef = useRef(null);

  const handleFooter = () => {
    var element = document.getElementById("myDIV");
    element.classList.toggle("mystyle");
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      var element = document.getElementById("myDIV");
      if (element.classList.contains("mystyle")) {
        element.classList.remove("mystyle");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="navigate-popup" id="myDIV" ref={popupRef}>
        <div className="nav-popup-logo">
          <img src={logo} alt="logo" className="icon" />
        </div>
        <div className="nav-popup-h2">
          <h2>
            Download the 'Aao Ni Saa'
            <br /> App For this feature
          </h2>
        </div>
        <div className="nav-popup-button">
          <a href="https://play.google.com/store/apps/details?id=com.aaonisaalive">
            <button>Get the App</button>
          </a>
        </div>
        <div className="nav-popup-link">
          <Link to="/support">Help & support</Link>
          {/* <a href="/support" ></a> */}
        </div>
      </div>

      <div className="navigate-modal">
        <div className="navigate-main">
          <div className="navigate-icons nav-home" onClick={handleFooter}>
            <AiFillHome />
          </div>
          <div className="navigate-icons nav-logo" onClick={handleFooter}>
            <img src={logo} className="icon" />
          </div>
          <div className="navigate-icons nav-plus" onClick={handleFooter}>
            <FaPlus />
          </div>
          <div className="navigate-icons nav-play" onClick={handleFooter}>
            <FaPlay />
          </div>
          <div className="navigate-icons nav-user" onClick={handleFooter}>
            <FaUser />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigateFooter;
