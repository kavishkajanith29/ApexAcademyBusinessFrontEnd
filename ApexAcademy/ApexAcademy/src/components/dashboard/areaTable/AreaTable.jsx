import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Grade",
  "Medium",
  "Email",
  "Phone Number",
  "View",
];

const AreaTable = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [filter, setFilter] = useState("all"); // Track filter selection
  const [studentIdFilter, setStudentIdFilter] = useState(""); // Track student ID filter
  const itemsPerPage = 5; // Number of students per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/student/students/recent");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const getFilteredStudents = () => {
    return students.filter((student) => {
      const matchesFilter = filter === "all" || (filter === "approved" ? student.approved : !student.approved);
      const matchesStudentId = studentIdFilter === "" || student.studentid.toString().toUpperCase().includes(studentIdFilter.toUpperCase());
      return matchesFilter && matchesStudentId;
    });
  };

  const filteredStudents = getFilteredStudents();
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

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Recently Registered Students</h4>
        <div className="filter-container">
          <input
            id="studentIdFilter"
            type="text"
            placeholder="Filter by Student ID"
            value={studentIdFilter}
            onChange={(e) => {
              setStudentIdFilter(e.target.value.toUpperCase());
              setCurrentPage(1); // Reset to the first page when filter changes
            }}
            style={{
              fontSize: '16px',
              marginRight: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#333',
              padding: '5px'
            }}
          />
          <select
            id="filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset to the first page when filter changes
            }}
            style={{                                 
              fontSize: '16px',    
              marginLeft:'10px',       
              marginBottom:'10px',          
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#333'
            }}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="not_approved">Not Approved</option>
          </select>
        </div>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getVisibleStudents().map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.studentid}</td>
                <td>{dataItem.studentname}</td>
                <td>{dataItem.grade}</td>
                <td>{dataItem.medium}</td>
                <td>
                  <div className="dt-status">
                    <span className="dt-status-text" style={{ textTransform: 'lowercase' }}>{dataItem.email}</span>
                  </div>
                </td>
                <td>{dataItem.phonenumber}</td>
                <td className="dt-cell-action">
                  <Button onClick={() => navigate(`/student/${dataItem.studentid}`)}>
                    View
                  </Button>
                </td>
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
                style={{
                  fontSize: '16px',
                  marginLeft: '10px',
                  paddingRight: '10px',
                  paddingBottom: '5px',
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
