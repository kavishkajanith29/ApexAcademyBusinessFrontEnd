import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, GenerateQR, GetStudentsAttendance, MessageScreen, PageNotFound, Payments } from "./screens";
import Teachers from "./screens/teachers/TeachersScreen";
import Students from "./screens/students/StudentsScreen";
import Classes from "./screens/classes/ClassesScreen";
import Login from "./pages/Login"
import PrivateRoutes from "./PrivateRoutes";
import StudentDetails from "./pages/StudentDetails";


function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);


  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route path = "/" element = {<Login/>}/>
          <Route element={<PrivateRoutes/>}>
            <Route element={<BaseLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student/:id" element={<StudentDetails />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/message" element={<MessageScreen/>} />
            <Route path="/payment" element={<Payments/>} />
            <Route path="/attendance" element={<GetStudentsAttendance/>} />
            <Route path="/qrgenerate" element={<GenerateQR/>} />
            <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
        
      </Router>
    </>
  );
}

export default App;
