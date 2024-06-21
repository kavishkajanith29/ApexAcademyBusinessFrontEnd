import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './PieChart.scss';
import { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate , useParams } from "react-router-dom";

// const data = [
//   { id: 0, value: 10, label: 'Marks 75-100' },
//   { id: 1, value: 15, label: 'Marks 65-74' },
//   { id: 2, value: 20, label: 'Marks 55-64' },
//   { id: 3, value: 5, label: 'Marks 40-54' },
//   { id: 4, value: 2, label: 'Marks 0-39' },
// ];

export default function PieActiveArc() {
  const [markFilter, setMarkFilter] = useState([]);
  const [data, setData] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const { id } = useParams(); 


  useEffect(() => {
    const fetchMarksDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/mark/all");
        //setTeachers(response.data);
        //console.log(response.data)
        const filteredMarksDetails = response.data.filter(enrollment => 
          enrollment.exam.subject.subjectid === id
        );
        setMarkFilter(filteredMarksDetails);
        //setTeachers(filteredMarksDetails);
        //console.log(filteredMarksDetails);
        updateChartData(filteredMarksDetails, monthFilter);
        console.log("hereallmarkavarage1")
      } catch (error) {
        console.error("Error fetching marksdetails:", error);
      }
    };

    fetchMarksDetails();
  }, [id, monthFilter]);

  const updateChartData = (marksDetails, month) => {
    const counts = {
      '0-39': 0,
      '40-54': 0,
      '55-64': 0,
      '65-74': 0,
      '75-100': 0
    };

    marksDetails.forEach(enrollment => {
      const mark = enrollment.mark;
      const enrollmentMonth = new Date(enrollment.exam.examDate).toLocaleString('default', { month: 'long' });
      if (month === "" || enrollmentMonth === month) {
        if (mark >= 0 && mark <= 39) {
          counts['0-39']++;
        } else if (mark >= 40 && mark <= 54) {
          counts['40-54']++;
        } else if (mark >= 55 && mark <= 64) {
          counts['55-64']++;
        } else if (mark >= 65 && mark <= 74) {
          counts['65-74']++;
        } else if (mark >= 75 && mark <= 100) {
          counts['75-100']++;
        }
      }
    });
    const pieData = [
      { id: 0, value: counts['75-100'], label: 'Marks 75-100' },
      { id: 1, value: counts['65-74'], label: 'Marks 65-74' },
      { id: 2, value: counts['55-64'], label: 'Marks 55-64' },
      { id: 3, value: counts['40-54'], label: 'Marks 40-54' },
      { id: 4, value: counts['0-39'], label: 'Marks 0-39' },
    ];

    setData(pieData);
  };
  return (
    <div className= 'content-area-table'>
        <h4 className="data-table-title" >Average Result of Student</h4>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Month</option>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
            ))}
        </select>
    <PieChart
    
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
    </div>
  );
}