import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ThemeContext } from "../../../context/ThemeContext";
import "./RevenueReport.scss";
import "./MonthlyRevenueReport.scss";
import LogoBlue from "../../../assets/images/logo_blue.svg";

const preprocessData = (fees, registrationFees, selectedYear) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const aggregatedData = months.map(month => ({ month, classFeeAmount: 0, registrationFeeAmount: 0 }));

  fees.forEach(fee => {
    const feeDate = new Date(fee.month);
    if (feeDate.getFullYear() === selectedYear) {
      const monthIndex = feeDate.getMonth();
      const feeAmount = parseFloat(fee.amount);
      aggregatedData[monthIndex].classFeeAmount += feeAmount;
    }
  });

  registrationFees.forEach(fee => {
    const feeDate = new Date(fee.paymentDate);
    if (feeDate.getFullYear() === selectedYear) {
      const monthIndex = feeDate.getMonth();
      const feeAmount = parseFloat(fee.amount);
      aggregatedData[monthIndex].registrationFeeAmount += feeAmount;
    }
  });

  return aggregatedData;

};

const getStudentCountByYear = (students, selectedYear) => {
  return students.filter(student => new Date(student.registrationdate).getFullYear() === selectedYear).length;
};

const Report = () => {
  const { theme } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [registrationFees, setRegistrationFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const timeNow = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesResponse, registrationFeesResponse, studentsResponse] = await Promise.all([
          axios.get("http://localhost:8085/api/v1/fees/all"),
          axios.get("http://localhost:8085/api/v1/payment/all"),
          axios.get("http://localhost:8085/api/v1/student/students/recent")
        ]);
        setFees(feesResponse.data);
        setRegistrationFees(registrationFeesResponse.data);
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error("Error fetching the data:", error);
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
      pdf.save(`Apex Academy annual Report ${selectedYear}.pdf`);
    });
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return <div>Loading...</div>;
  }

  const data = preprocessData(fees, registrationFees, selectedYear);
  const studentCount = getStudentCountByYear(students, selectedYear);

  return (
    <div className="revenue-report">
      <h1 className="report-title">Annual Report</h1>
      <div className="filter-containers">
        <select value={selectedYear} onChange={handleYearChange}>
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        {/* <select value={selectedMonth} onChange={handleMonthChange}>
          {monthOptions.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select> */}
        <button onClick={generatePDF} className="generate-pdf-button">Generate PDF</button>
      </div>
      <div id="revenue-report" className="report-content" >
      <div  style={{backgroundColor:"#e6f7ff",margin:-20,marginBottom:40,paddingBottom:0}} >
      <span style={{marginLeft:35}}><img style={{width:130,marginTop:35}} src={LogoBlue} alt="" /></span>
        <div className="header" style={{marginLeft:200,marginTop:-135}}>
          <span className="haderName">APEX Business Academy (pvt) LTD</span>
          <h3>Annual Report of Year {selectedYear}</h3>
          <span >
            Contact No: 091-5486912 <br />
            Address: 104/B, Rahula Road, Matara
          </span>
          <div style={{marginLeft:320,marginTop:-22,marginBottom:0,fontWeight:"bold"}}>
            {timeNow}
          </div>
          <p style={{fontSize:20}}></p>
          <span style={{marginRight:100}}></span>
        </div>
      </div>
      <div style={{marginTop:"-30px",fontWeight:"bold",fontSize:25}}>Annual Summery of Year {selectedYear}</div>
        <table className="report-table" style={{marginBottom:20}}>
          <thead>
            <tr>
              <th style={{width:"15%",textAlign:"center",fontSize:14,backgroundColor:"#122569"}} >Month</th>
              <th style={{width:"20%",textAlign:"center",fontSize:14}} >Revenue from Class Fees Rs.</th>
              <th style={{width:"20%",textAlign:"center",fontSize:14}}>Payments for Teachers Rs.</th>
              <th style={{width:"20%",textAlign:"center",fontSize:14}}>Profit from Class Fees Rs.</th>
              <th style={{width:"20%",textAlign:"center",fontSize:14}}>Revenue from Registration Fees Rs.</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              if (selectedMonth === "All" || item.month === selectedMonth) {
                return (
                  <tr key={index}>
                    <td >{item.month}</td>
                    <td style={{backgroundColor:"#e6f7ff",textAlign:"right"}}>{item.classFeeAmount.toLocaleString()}.00</td>
                    <td style={{backgroundColor:"#e6f7ff",textAlign:"right"}}>{(item.classFeeAmount * 0.8).toLocaleString()}.00</td>
                    <td style={{backgroundColor:"#e6f7ff",textAlign:"right"}}>{(item.classFeeAmount * 0.2).toLocaleString()}.00</td>
                    <td style={{backgroundColor:"#e6f7ff",textAlign:"right"}}>{item.registrationFeeAmount.toLocaleString()}.00</td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
          <tfoot>
            <tr style={{}}>
              <th >Total</th>
              <th style={{textAlign:"right"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.classFeeAmount : 0), 0).toLocaleString()}.00</th>
              <th style={{textAlign:"right"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.classFeeAmount * 0.8 : 0), 0).toLocaleString()}.00</th>
              <th style={{textAlign:"right"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.classFeeAmount * 0.2 : 0), 0).toLocaleString()}.00</th>
              <th style={{textAlign:"right"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.registrationFeeAmount : 0), 0).toLocaleString()}.00</th>
            </tr>
          </tfoot>
        </table>
        <span style={{fontSize:16}}>
        <table className="report-table" >
            <tr>
              <td style={{border:"none"}}>Total Revenue from Class Fees</td><td style={{paddingLeft:10,border:"none"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.classFeeAmount : 0), 0).toLocaleString()}.00</td>
            </tr>
            <tr>
              <td style={{border:"none"}}>Total Payments for Teachers</td><td style={{paddingLeft:10,border:"none"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.classFeeAmount * 0.8 : 0), 0).toLocaleString()}.00</td>
            </tr>
            <tr>
              <td style={{border:"none"}}>Total Profit from Class Fees</td><td style={{paddingLeft:10,border:"none"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.classFeeAmount * 0.2 : 0), 0).toLocaleString()}.00</td>
            </tr>
            <tr>
              <td style={{border:"none"}}>Total Revenue from Registration Fees</td><td style={{paddingLeft:10,border:"none"}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? item.registrationFeeAmount : 0), 0).toLocaleString()}.00</td>
            </tr>
            <tr>
              <td style={{border:"none",fontWeight:"bold",fontSize:16}}>Total Profit from Registration Fees & Class Fees in year {selectedYear} </td><td style={{borderTop: "1px solid",fontSize:16, borderBottom: "3px double",borderLeft: "none",borderRight: "none",fontWeight:"bold",paddingLeft:10,width:100}}>Rs.{data.reduce((acc, item) => acc + (selectedMonth === "All" || item.month === selectedMonth ? (item.registrationFeeAmount + (item.classFeeAmount * 0.2 )) : 0), 0).toLocaleString()}.00</td>
            </tr>
            <tr>
              <td style={{border:"none",fontWeight:"bold",fontSize:16}}>Number of new Students Registered in year {selectedYear} : {studentCount}</td><td style={{border:"none"}}></td>
            </tr>
          </table>
          </span>
      </div>
    </div>
  );
};

export default Report;
