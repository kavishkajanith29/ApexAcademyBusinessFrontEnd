import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Subject",
  "Teacher Name",
  "Enrollment Date",
  " ",
];
const EnrollTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const [subjectFilter, setSubjectFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/enrollment/recent");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

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

  const handleSubjectFilterChange = (e) => {
    const formattedValue = e.target.value;
    setSubjectFilter(formattedValue);
  };

  const handleTeacherFilterChange = (e) => {
    const formattedValue = e.target.value;
    setTeacherFilter(formattedValue);
  };

  const getFilteredSubjects = () => {
    return subjects.filter((subject) => {
      const normalizedSubjectName = subject.student.studentid ? subject.student.studentid.toLowerCase() : '';
      const normalizedTeacherName = subject.subject.teacher.teachername ? subject.subject.teacher.teachername.toLowerCase() : '';
      return (
        (subjectFilter === "" || normalizedSubjectName.includes(subjectFilter.toLowerCase())) &&
        (teacherFilter === "" || normalizedTeacherName.includes(teacherFilter.toLowerCase()))
      );
    });
  };

  const totalPages = Math.ceil(getFilteredSubjects().length / itemsPerPage);

  const getVisibleSubjects = () => {
    const filteredSubjects = getFilteredSubjects();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredSubjects.length);
    return filteredSubjects.slice(startIndex, endIndex);
  };

  const getUniqueValues = (key) => {
    return [...new Set(subjects.map((subject) => subject[key]))];
  };

  return (
    <section className="content-area-table" style={{ marginTop: '20px' }}>
      <div className="data-table-info">
        <h4 className="data-table-title">Students Enrollments</h4>
      </div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Student"
          value={subjectFilter}
          onChange={handleSubjectFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by teacher name"
          value={teacherFilter}
          onChange={handleTeacherFilterChange}
        />
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
            {getVisibleSubjects().map((dataItem) => (
              <tr key={dataItem.enrollmentId}>
                <td>{dataItem.student ? dataItem.student.studentid : ''}</td>
                <td>{dataItem.subject ? dataItem.subject.subjectid : ''}</td>
                <td>{dataItem.subject ? dataItem.subject.medium : ''}</td>
                <td>{dataItem.subject.teacher ? dataItem.subject.teacher.teachername : ''}</td>
                <td>
                  <div className="dt-status">
                    <span className="dt-status-text">{dataItem.enrollmentDate}</span>
                  </div>
                </td>
                <td className="dt-cell-action">
                  <Button onClick={() => navigate(`/classes/${dataItem.subjectid}`)}>
                    UnEnroll
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


export default EnrollTable;
