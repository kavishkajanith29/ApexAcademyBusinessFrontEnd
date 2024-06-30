import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, GenerateQR, GetStudentsAttendance, PageNotFound, Payments, ReportScreen, StudentEnroll } from "./screens";
import Teachers from "./screens/teachers/TeachersScreen";
import Students from "./screens/students/StudentsScreen";
import Classes from "./screens/classes/ClassesScreen";
import Login from "./pages/Login";
import PrivateRoutes from "./PrivateRoutes";
import StudentDetails from "./pages/StudentDetails";
import TeacherDetails from "./pages/TeacherDetails";
import ClassesDetails from "./pages/ClassesDetails";
import { MonthlyReport, Report } from "./components";
import Profile from "./pages/Profile";

function App() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<BaseLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/:id" element={<TeacherDetails />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student/:id" element={<StudentDetails />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassesDetails />} />
            <Route path="/enroll" element={<StudentEnroll />} />
            <Route path="/payment" element={<Payments />} />
            <Route path="/attendance" element={<GetStudentsAttendance />} />
            <Route path="/qrgenerate" element={<GenerateQR />} />
            <Route path="/report" element={<ReportScreen />} />
            <Route path="/report/reportgenerate" element={<Report/>} />
            <Route path="/report/monthlyreportgenerate" element={<MonthlyReport/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
