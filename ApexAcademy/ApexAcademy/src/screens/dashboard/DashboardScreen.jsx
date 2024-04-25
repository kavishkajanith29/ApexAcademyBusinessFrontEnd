import { AreaCards, AreaCharts, AreaTable, AreaTop, TeacherTable } from "../../components";

const Dashboard = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaCards />
      <AreaCharts />
      <AreaTable />
      <TeacherTable/>
    </div>
  );
};

export default Dashboard;
