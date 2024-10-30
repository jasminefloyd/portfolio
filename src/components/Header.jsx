import React, { useState } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header">
      <img src="./src/assets/jf_logo.png" alt="Logo" />
      <nav>
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul className={`nav-list ${menuOpen ? "active" : ""}`}>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Resume</a></li>
          <li><a href="#">Contact Me</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
