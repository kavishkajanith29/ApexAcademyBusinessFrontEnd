import {AreaReportCards, AreaReportCharts, AreaReportTop} from "../../components";

const Reports = () => {
  return (
    <div className="content-area">
      <AreaReportTop />
      <AreaReportCards />
      <AreaReportCharts />
    </div>
  );
};

export default Reports;
