import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import moment from 'moment';
import { PieChart } from '@mui/x-charts/PieChart';

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Attendance Date",
];

const Attendent = () => {
  const [attendent, setAttendent] = useState([]);
  const studentId = localStorage.getItem('studentId');
  const subjectId = localStorage.getItem('subjectId');
  const [currentPage, setCurrentPage] = useState(1); 
  const [filter, setFilter] = useState("all"); 
  const itemsPerPage = 5; // Number of students per page
  const navigate = useNavigate();
  const [monthFilter, setMonthFilter] = useState(moment().format("YYYY-MM")); 

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/attendance/student/${studentId}/subject/${subjectId}`);
        setAttendent(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching attendent', error);
      }
    };

    fetchEnrollments();
  }, [studentId, subjectId]);

  const getFilteredStudents = () => {
    return attendent.filter((student) => {
      if (filter === "all") return true;
      return filter === "approved" ? student.approved : !student.approved;
    });
  };

  const filteredStudents = getFilteredStudents().filter((student) => {
    if (!monthFilter) return true;
    const attendanceDate = moment(student.attendanceDate);
    return attendanceDate.isValid() && attendanceDate.format("YYYY-MM") === monthFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage); // Calculate total pages

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getVisibleStudents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredStudents.length);
    return filteredStudents.slice(startIndex, endIndex);
  };

  const visibleStudents = getVisibleStudents();

  const totalFilteredAttendance = filteredStudents.length;
  const presentAttendance = filteredStudents.filter(student => student.status).length;

  const data = [
    { id: 0, value: presentAttendance, label: 'Present' },
    { id: 1, value: totalFilteredAttendance - presentAttendance, label: 'Absent' },
  ];

  const attendancePercentage = ((presentAttendance / totalFilteredAttendance) * 100).toFixed(2);

  return (
    <div>
      <section className="content-area-table">
        <div className="data-table-info">
          <h3 className="data-table-title">Attendance Dates</h3>
          <div className="filter-options">
            <label htmlFor="monthFilter" style={{ marginLeft: '20px' }}>Filter by Month:</label>
            <input
              type="month"
              id="monthFilter"
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setCurrentPage(1); // Reset to the first page when month filter changes
              }}
              style={{ fontSize: '16px', marginLeft: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
            />
            <Button onClick={() => setMonthFilter("")} style={{ marginLeft: '20px' ,marginBottom: '15px'}}>All Attendance</Button>
          </div>
        </div>
        <div className="data-table-diagram">
          <table>
            <thead>
              <tr>
                {TABLE_HEADS?.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((dataItem) => (
                <tr key={dataItem.attendanceId}>
                  <td>{dataItem.student.studentid}</td>
                  <td>{dataItem.student.studentname}</td>
                  <td>{moment(dataItem.attendanceDate).format('YYYY-MM-DD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="data-table-navigation">
              <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={handlePrev}>
                Prev
              </Button>
              <span style={{ marginLeft: '10px', marginRight: '10px' }}>
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={handleNext}>
                Next
              </Button>
              <span className="dropnavigation">
                <select
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value))}
                  style={{ fontSize: '16px', marginLeft: '10px', paddingRight: '10px', paddingBottom: '5px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </span>
            </div>
          )}
        </div>
      </section>
      <div className="pie-chart-section flex flex-col mt-4 md:flex-row items-center md:items-start">
        <div style={{marginLeft:20}}>
        <PieChart 
          series={[
            {
              data,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={200}
          width={350}
        />
        </div>
        <span className="attendance-percentage mt-6 md:mt-10 md:ml-4 items-center w-full text-center">
          <p>Attendance Percentage: {attendancePercentage !==  'NaN' ? attendancePercentage : 0}%</p>
        </span>
      </div>
    </div>
  );
};

export default Attendent;
