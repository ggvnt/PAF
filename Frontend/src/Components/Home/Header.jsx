import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  
  return (
    <header className="header">
      <nav>
        <div className="nav__header">
          <div className="nav__logomain">
            <Link to="/">
              <img src="/assets/learnloop.svg" alt="LearnLoop logo" />
            </Link>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
        <ul className="nav__links" id="nav-links">
          <li className="link">
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className="link">
            <Link to="#explore-courses">Explore Courses</Link>
          </li>
          <li className="link">
            <Link
              to="/become-instructor"
              onClick={(e) => {
                if (!localStorage.getItem("userId")) {
                  e.preventDefault();
                  setIsAuthModalOpened(true); // Open the authentication modal if not logged in
                }
              }}
            >
              Become an Instructor
            </Link>
          </li>
          <li className="link">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the dashboard page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Join LearnLoop
            </button>
          </li>
        </ul>
      </nav>
      <div className="section__container header__container" id="home">
        <div>
          <img src="/assets/learnloop-hero.svg" alt="LearnLoop hero" />
        </div>
        <div className="header__content">
          <h4>Learn Anything, Anytime</h4>
          <h1 className="section__header">Discover Your Learning Potential with LearnLoop!</h1>
          <p>
            Access high-quality courses across multiple disciplines, from programming to design, business to personal development. Join LearnLoop and connect with a community of lifelong learners and expert instructors.
          </p>
          <div className="header__btn">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/courses"); // Navigate to the courses page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Start Learning Today
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        onClose={() => setIsAuthModalOpened(false)}
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;