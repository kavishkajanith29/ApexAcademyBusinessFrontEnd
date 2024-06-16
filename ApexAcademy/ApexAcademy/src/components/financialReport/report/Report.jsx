import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ThemeContext } from "../../../context/ThemeContext";
import "./RevenueReport.scss";

const preprocessData = (fees, selectedYear) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const aggregatedData = months.map(month => ({ month, amount: 0 }));


  fees.forEach(fee => {
    const feeDate = new Date(fee.month);
    if (feeDate.getFullYear() === selectedYear) {
      const monthIndex = feeDate.getMonth();
      const feeAmount = parseFloat(fee.amount);
      aggregatedData[monthIndex].amount += feeAmount;
    }
  });

  return aggregatedData;
};

const Report = () => {
  const { theme } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("All");

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

  const generatePDF = () => {
    const input = document.getElementById('revenue-report');
    const padding = 10;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgWidth = pdfWidth - 2 * padding;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const yPos = imgHeight < (pdfHeight - 2 * padding) ? (pdfHeight - imgHeight) / 2 : padding;

      pdf.addImage(imgData, 'PNG', padding, yPos, imgWidth, imgHeight);
      pdf.save(`Revenue_Report_${selectedYear}.pdf`);
    });
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return <div>Loading...</div>;
  }

  const data = preprocessData(fees, selectedYear);

  return (
    <div className="revenue-report">
      <h1 className="report-title">Annual Report</h1>
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
        <button onClick={generatePDF} className="generate-pdf-button">Generate PDF</button>
      </div>
      <div id="revenue-report" className="report-content">
        <div className="header">
          <h2>Apex Business Academy</h2>
          <h3>Monthly Financial Report {selectedMonth}</h3>
          <p>{selectedYear}</p>
          <span style={{marginRight:100}}></span>
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
            {data.map((item, index) => {
              if (selectedMonth === "All" || item.month === selectedMonth) {
                return (
                  <tr key={index}>
                    <td>{item.month}</td>
                    <td>Rs.{item.amount.toLocaleString()}</td>
                    <td>Rs.{(item.amount * 0.2).toLocaleString()}</td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.amount : 0), 0).toLocaleString()}</th>
              <th>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.amount * 0.2 : 0), 0).toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Report;
