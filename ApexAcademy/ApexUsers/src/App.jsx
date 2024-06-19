import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Class, Dashboard, ExamUpdate, MessageUpdate, PageNotFound, TeachersClass } from "./screens";
import LoginPageHome from "./pages/LoginPageHome"
import LoginPage from "./pages/LoginPage";
import LoginTeacher from "./pages/LoginTeacher";
import LoginStudent from "./pages/LoginStudent";
import StudentBaseLayout from "./layout/BaseLayoutStudent";
import { Myclass, StudentsClass, StudentsMyProfile } from "./studentscreen";
import StudentForm from "./pages/studentsForm";
import RegistrationSuccsusful from "./pages/RegistrationSuccsusful";


function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
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
        <Route path="/" element={<LoginPageHome />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/LoginPage/teacher" element={<LoginTeacher />} />
        <Route path="/LoginPage/student" element={<LoginStudent />}/>
        <Route path="/LoginPage/student/register" element={<StudentForm />}/>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/student/:id" element={<RegistrationSuccsusful />} />
        <Route element={<BaseLayout />}>
            <Route path="/LoginPage/teacher/dashboard" element={<Dashboard />} />
            <Route path="/teacher/myclass" element={<TeachersClass />} />
            <Route path="/teacher/class/:id" element={<Class />} />
            <Route path="/teacher/examUpdate" element={<ExamUpdate />} />
            <Route path="/teacher/message" element={<MessageUpdate />} />
          </Route>
          <Route element={<StudentBaseLayout />}>
            <Route path="/LoginPage/student/dashboard" element={<Myclass/>} />
            <Route path="/student/pfofile" element={<StudentsMyProfile/>} />
            <Route path="/student/class/:id" element={<StudentsClass/>} />
          </Route>
        </Routes>

        {/* <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button> */}
        
      </Router>
    </>
  );
}

export default App;
