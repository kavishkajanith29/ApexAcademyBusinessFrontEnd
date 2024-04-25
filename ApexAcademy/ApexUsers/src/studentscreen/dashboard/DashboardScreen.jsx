import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../studentcomponents";

const StudentDashboard = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaCards />
      <AreaCharts />
      <AreaTable />
    </div>
  );
};

export default StudentDashboard;
