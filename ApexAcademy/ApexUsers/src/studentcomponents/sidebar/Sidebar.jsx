import  { useState } from 'react'
import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";

import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import {
  MdOutlineClose,
  MdOutlineLogout,
} from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";

import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const [action,setAction] = useState("myclass")

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <nav
    className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
    ref={navbarRef}
  >
    <div className="sidebar-top">
      <div className="sidebar-brand">
        <img style={{borderRadius:20}} src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
        <span className="sidebar-brand-text">Apex Business Academy</span>
      </div>
      <button className="sidebar-close-btn" onClick={closeSidebar}>
        <MdOutlineClose size={24} />
      </button>
    </div>
    <div className="sidebar-body">
      <div className="sidebar-menu">
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="LoginPage/student/dashboard" className={action==="myclass"?"menu-link active":"menu-link"} onClick={ () => setAction("myclass")}>
              <span className="menu-link-icon">
                <LiaChalkboardTeacherSolid size={20} />
              </span>
              <span className="menu-link-text">My Classes</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-menu sidebar-menu2">
        <ul className="menu-list">
        <li className="menu-item">
            <Link to="/student/pfofile" className={action==="pfofile"?"menu-link active":"menu-link"} onClick={ () => setAction("pfofile")}>
              <span className="menu-link-icon">
                <PiStudentBold size={20} />
              </span>
              <span className="menu-link-text">My Profile</span>
            </Link>
          </li> 
          <li className="menu-item">
            <Link to="/LoginPage/student" className="menu-link" onClick={handleLogout}>
              <span className="menu-link-icon">
                <MdOutlineLogout size={20} />
              </span>
              <span className="menu-link-text">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default Sidebar
