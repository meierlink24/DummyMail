import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`menu ${isMobile ? "mobile" : ""}`}>
      {isMobile && (
        <button className="hamburger" onClick={toggleMenu}>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
        </button>
      )}

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li
          className={`nav-item ${
            location.pathname === "/" || location.pathname === "/section/Home"
              ? "active"
              : ""
          }`}
          onClick={closeMenu}
        >
          <Link to="/section/Home">Home</Link>
        </li>
        <li
          className={`nav-item ${
            location.pathname === "/create-mail" ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          <Link to="/create-mail">Create Mail</Link>
        </li>
        <li className="nav-item" onClick={closeMenu}>
          <a
            href="https://github.com/meierlink24/DummyMail.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;