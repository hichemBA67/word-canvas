// Header.js
import React from "react";
import "./style/Header.css";
import { Link } from "react-router-dom";
import WCLogo from "../assets/images/WC.png";
import byslidemotifLogo from "../assets/images/byslidemotif.png";
const API_URL = process.env.REACT_APP_API_URL;

const Header = () => {
  return (
    <header className="headerContainer">
      <div className="logoContainer">
        <img src={WCLogo} alt="WC Logo" className="logo" />
        <img src={byslidemotifLogo} alt="" className="slidemotifLogo" />
      </div>
      <nav>
        <ul className="navList">
          <li className="navItem">
            <Link to="/">Home</Link>
          </li>
          <li className="navItem">
            <Link to="/demo">Demo</Link>
          </li>
          <li className="navItem">
            <Link to="/settings">Settings</Link>
          </li>
          {/* <li className="navItem">
            <Link to="/words">Words</Link>
          </li>
          <li className="navItem">
            <Link to="/fillers">Fillers</Link>
          </li> */}
          <li className="navItem">
            <a
              href={`${API_URL}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
