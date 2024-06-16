import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeContext";
import "./MonthlyRevenueReport.scss";
import "./MonthlyRevenueReportPrint.scss"; // Import print styles

const preprocessData = (fees, selectedYear, selectedMonth) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const aggregatedData = months.map(month => ({ month, amount: 0 }));

  fees.forEach(fee => {
    const feeDate = new Date(fee.month);
    if (feeDate.getFullYear() === selectedYear && ( feeDate.getMonth() === months.indexOf(selectedMonth))) {
      const monthIndex = feeDate.getMonth();
      const feeAmount = parseFloat(fee.amount);
      aggregatedData[monthIndex].amount += feeAmount;
    }
  });

  return aggregatedData;
};

const MonthlyReport = () => {
  const { theme } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleDateString('en-US', { month: 'long' }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/fees/all");
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching the fees data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
  };

  const printReport = () => {
    const printContents = document.getElementById("print-content").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return <div>Loading...</div>;
  }

  const data = preprocessData(fees, selectedYear, selectedMonth);

  const filteredData = data.filter(item => selectedMonth === "All" || item.month === selectedMonth);

  return (
    <div className="revenue-report">
      <h1 className="report-title">Monthly Financial Report</h1>
      <div className="filter-containers">
        <select value={selectedYear} onChange={handleYearChange}>
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {monthOptions.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <button onClick={printReport} className="print-button">Print </button>
      </div>
      <div id="print-content" className="revenue-report-print"> {/* Use this as the print container */}
        <div className="report-content">
          <div className="header">
            <h2>APEX Business Acadamy <br />(pvt) LTD </h2>
            <h3>Monthly Report <br />{selectedYear} {selectedMonth}</h3>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue from Class fees</th>
                <th>Profit from Class fees</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>Rs.{item.amount.toLocaleString()}</td>
                  <td>Rs.{(item.amount * 0.2).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th>Rs.{filteredData.reduce((acc, item) => acc + item.amount, 0).toLocaleString()}</th>
                <th>Rs.{filteredData.reduce((acc, item) => acc + (item.amount * 0.2), 0).toLocaleString()}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
