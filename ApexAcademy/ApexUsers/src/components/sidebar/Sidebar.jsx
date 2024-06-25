import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { SiGoogleclassroom } from "react-icons/si";
import {
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineMessage,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiExamBold } from "react-icons/pi";

import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const [action, setActionState] = useState("dashboard");

  // closing the navbar when clicked outside the sidebar area
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
    const storedAction = localStorage.getItem('activeMenuItemTeacher');
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
    localStorage.setItem('activeMenuItemTeacher', action);
    setActionState(action);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticatedTeacher');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('activeMenuItemTeacher');
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
              <Link to="LoginPage/teacher/dashboard" className={action==="dashboard"?"menu-link active":"menu-link"} onClick={ () => setAction("dashboard")}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/teacher/myclass" className={action==="myclass"?"menu-link active":"menu-link"} onClick={ () => setAction("myclass")}>
                <span className="menu-link-icon">
                  <LiaChalkboardTeacherSolid size={20} />
                </span>
                <span className="menu-link-text">My Class</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/teacher/examUpdate" className={action==="examUpdate"?"menu-link active":"menu-link"} onClick={ () => setAction("examUpdate")}>
                <span className="menu-link-icon">
                  <PiExamBold size={20} />
                </span>
                <span className="menu-link-text">Exam Result Upload</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/teacher/examCreate" className={action==="examCreate"?"menu-link active":"menu-link"} onClick={ () => setAction("examCreate")}>
                <span className="menu-link-icon">
                  <SiGoogleclassroom size={20} />
                </span>
                <span className="menu-link-text">Create Exam Date</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/teacher/message" className={action==="message"?"menu-link active":"menu-link"} onClick={ () => setAction("message")}>
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">Messages</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
          <li className="menu-item" >
              <Link to="/teacher/profile"  className={action==="Profile"?"menu-link active":"menu-link"} onClick={ () => setAction("Profile")} >
                <span className="menu-link-icon" >
                  <CgProfile size={20} />
                </span>
                <span className="menu-link-text">Profile</span>
              </Link>
            </li>
            <li className="menu-item"  onClick={handleLogout}>
              <Link to="/LoginPage/teacher" className="menu-link" >
                <span className="menu-link-icon" >
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
