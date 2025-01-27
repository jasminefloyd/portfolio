import React, { useState } from "react";
import { Link } from "react-router-dom";
import mainLogoImg from '../assets/jf_logo.png';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header">
      <img src={mainLogoImg} alt="Logo" />
      <nav>
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul className={`nav-list ${menuOpen ? "active" : ""}`}>
          {/* Replace href with Link components */}
          <li><Link to="/portfolio">🏠 Home</Link></li>
          <li className="blog-nav"><Link to="/blog">Blog</Link></li>
          <li><Link to="/resume">Resume</Link></li>
          <li><a href="#contact-section">Contact Me</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
