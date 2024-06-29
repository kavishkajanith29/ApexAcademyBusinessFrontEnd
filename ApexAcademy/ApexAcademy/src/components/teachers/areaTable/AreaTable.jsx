import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TABLE_HEADS = [
  "Teacher ID",
  "Teacher Name",
  "Subject",
  "Medium",
  "Email",
  "View",
];

const AreaTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const [teacherIdFilter, setTeacherIdFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/teacher/teachers/recent");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const totalPages = Math.ceil(teachers.length / itemsPerPage);

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

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\B\w/g, (char) => char.toLowerCase());
  };

  const handleSubjectFilterChange = (e) => {
    const formattedValue = capitalizeWords(e.target.value);
    setSubjectFilter(formattedValue);
  };

  const getFilteredTeachers = () => {
    return teachers.filter((teacher) => {
      return (
        (teacherIdFilter === "" || teacher.teacherid.toString().includes(teacherIdFilter)) &&
        (subjectFilter === "" || teacher.subject.toLowerCase().includes(subjectFilter.toLowerCase())) &&
        (mediumFilter === "" || teacher.medium.includes(mediumFilter)) &&
        (gradeFilter === "" || 
          (gradeFilter === "A/L" && teacher.grade.includes("A/L")) ||
          (gradeFilter === "O/L" && teacher.grade.includes("O/L")))
      );
    });
  };

  const getVisibleTeachers = () => {
    const filteredTeachers = getFilteredTeachers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredTeachers.length);
    return filteredTeachers.slice(startIndex, endIndex);
  };

  const getUniqueValues = (key) => {
    return [...new Set(teachers.map((teacher) => teacher[key]))];
  };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Recently Registered Teachers</h4>
      </div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Teacher ID"
          value={teacherIdFilter}
          onChange={(e) => setTeacherIdFilter(e.target.value.toUpperCase())}
        />
        <input
          type="text"
          placeholder="Filter by subject"
          value={subjectFilter}
          onChange={handleSubjectFilterChange}
        />
        <select value={mediumFilter} onChange={(e) => setMediumFilter(e.target.value)}>
          <option value="">All Mediums</option>
          {getUniqueValues('medium').map((medium) => (
            <option key={medium} value={medium}>
              {medium}
            </option>
          ))}
        </select>
        <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="">All Grades</option>
          <option value="A/L">A/L</option>
          <option value="O/L">O/L</option>
        </select>
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
            {getVisibleTeachers().map((dataItem) => (
              <tr key={dataItem.teacherid}>
                <td>{dataItem.teacherid}</td>
                <td>{dataItem.teachername}</td>
                <td>{dataItem.subject}</td>
                <td>{dataItem.medium}</td>
                <td>
                  <div className="dt-status">
                    <span className="dt-status-text" style={{ textTransform: 'lowercase' }}>{dataItem.email}</span>
                  </div>
                </td>
                <td className="dt-cell-action">
                  <Button onClick={() => navigate(`/teachers/${dataItem.teacherid}`)}>
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
