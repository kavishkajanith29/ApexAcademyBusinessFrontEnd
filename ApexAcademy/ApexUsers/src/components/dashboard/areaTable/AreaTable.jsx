import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { Button } from "react-bootstrap";

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Grade",
  "Gender",
  "Email",
  "Phone Number",
  "Action",
];

const AreaTable = () => {
  const [studentDetails, setStudentDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [filter, setFilter] = useState("all"); // Track filter selection
  const itemsPerPage = 5
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/enrollment/recent`);
        if (response.ok) {
          const data = await response.json();
          //setStudentCount(data);
          //console.log(data);
          const filteredEnrollments = data.filter(enrollment => 
            enrollment.subject.teacher.teacherid === teacherId
          );
          setStudentDetails(filteredEnrollments);
          console.log(filteredEnrollments);
        } else {
          console.error("Failed to fetch student count");
        }
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };
    fetchStudentCount();
  }, []);

  const totalPages = Math.ceil(studentDetails.length / itemsPerPage); // Calculate total pages

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
    const endIndex = Math.min(startIndex + itemsPerPage, studentDetails.length);
    return studentDetails.slice(startIndex, endIndex);
  };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Recently Registered Students</h4>
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
            {getVisibleStudents()?.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.student.studentid}</td>
                  <td>{dataItem.student.studentname}</td>
                  <td>{dataItem.student.grade}</td>
                  <td>{dataItem.student.address}</td>
                  <td>
                    <div className="dt-status">
                      {/* <span
                        className={`dt-status-dot dot-${dataItem.email}`}
                      ></span> */}
                      <span className="dt-status-text">{dataItem.student.email}</span>
                    </div>
                  </td>
                  <td>{dataItem.student.phonenumber}</td>
                  <td className="dt-cell-action">
                    <Button onClick={() => navigate(`/student/${dataItem.studentid}`)}>
                    View
                  </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="data-table-navigation">
            <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={handlePrev}>
              Prev
            </Button>
            <span  style={{                                    
              marginLeft:'10px',       
              marginRight:'10px'         
            }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={handleNext}>
              Next
            </Button>
            <span className="dropnavigation">
            <select
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              style={{                                 
                fontSize: '16px',    
                marginLeft:'10px',                
                paddingRight: '10px',
                paddingBottom:'5px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                color: '#333'
              }}
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
  );
};

export default AreaTable;
