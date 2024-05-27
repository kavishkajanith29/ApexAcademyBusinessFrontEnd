import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import {
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineMessage,
  MdOutlineSettings,
} from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";

import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";



const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const [action, setActionState] = useState("dashboard");

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', false);
    setAction("dashboard");
  };

  useEffect(() => {
    const storedAction = localStorage.getItem('activeMenuItem');
  if (storedAction) {
    setAction(storedAction);
  } else {
    setAction("dashboard"); 
  }


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setAction = (action) => {
    localStorage.setItem('activeMenuItem', action);
    setActionState(action);
  };

  

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
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
              <Link to="/dashboard" className={action==="dashboard"?"menu-link active":"menu-link"} onClick={ () => setAction("dashboard")}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/teachers" className={action==="teachers"?"menu-link active":"menu-link"} onClick={ () => setAction("teachers")}>
                <span className="menu-link-icon">
                  <LiaChalkboardTeacherSolid size={20} />
                </span>
                <span className="menu-link-text">Teachers</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/students" className={action==="students"?"menu-link active":"menu-link"} onClick={ () => setAction("students")}>
                <span className="menu-link-icon">
                  <PiStudentBold size={20} />
                </span>
                <span className="menu-link-text">Students</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/payment" className={action==="classfee"?"menu-link active":"menu-link"} onClick={ () => setAction("classfee")}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Class Fee Payment</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/classes" className={action==="classes"?"menu-link active":"menu-link"} onClick={ () => setAction("classes")}>
                <span className="menu-link-icon">
                  <SiGoogleclassroom size={20} />
                </span>
                <span className="menu-link-text">Classes</span>
              </Link>
            </li>

            <li className="menu-item">
              <Link to="/enroll" className={action==="enroll"?"menu-link active":"menu-link"} onClick={ () => setAction("enroll")}>
                <span className="menu-link-icon">
                  <SiGoogleclassroom size={20} />
                </span>
                <span className="menu-link-text">Enroll Students</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link to="/message" className={action==="message"?"menu-link active":"menu-link"} onClick={ () => setAction("message")}>
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">Messages</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/attendance" className={action==="attendance"?"menu-link active":"menu-link"} onClick={ () => setAction("attendance")}>
                <span className="menu-link-icon">
                  <SiGoogleclassroom size={20} />
                </span>
                <span className="menu-link-text">Attendance</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/qrgenerate" className={action==="qrgenerate"?"menu-link active":"menu-link"} onClick={ () => setAction("qrgenerate")}>
                <span className="menu-link-icon">
                  <SiGoogleclassroom size={20} />
                </span>
                <span className="menu-link-text">Issue ID</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/" className="menu-link" onClick={handleLogout}>
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
  );
};

export default Sidebar;
