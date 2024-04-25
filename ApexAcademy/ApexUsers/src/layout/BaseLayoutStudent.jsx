import { Outlet } from "react-router-dom";
import { Sidebar } from "../studentcomponents";

const StudentBaseLayout = () => {
  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default StudentBaseLayout;
