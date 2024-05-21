import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";
import { ThemeContext } from "../context/ThemeContext";
import { LIGHT_THEME, DARK_THEME } from "../constants/themeConstants";
import SunIcon from "../assets/icons/sun.svg";
import MoonIcon from "../assets/icons/moon.svg";
import "../App.scss";

const BaseLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <main className="page-wrapper">
      {/* Left side of the page */}
      <Sidebar />
      {/* Right side/content of the page */}
      <div className="content-wrapper">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
            alt="theme icon"
          />
        </button>
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
