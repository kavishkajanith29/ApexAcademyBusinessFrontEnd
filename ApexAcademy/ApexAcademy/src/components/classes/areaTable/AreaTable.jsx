import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TABLE_HEADS = [
  "Subject ID",
  "Subject",
  "Teacher Name",
  "Medium",
  "Schedule Time",
  " ",
  " ",
];

const ClassesAreaTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const [subjectFilter, setSubjectFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/subject/all");
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
      const normalizedSubjectName = subject.subjectname ? subject.subjectname.toLowerCase() : '';
      const normalizedTeacherName = subject.teacher ? subject.teacher.teachername.toLowerCase() : '';
      return (
        (subjectFilter === "" || normalizedSubjectName.includes(subjectFilter.toLowerCase())) &&
        (teacherFilter === "" || normalizedTeacherName.includes(teacherFilter.toLowerCase())) &&
        (mediumFilter === "" || subject.medium.includes(mediumFilter)) &&
        (gradeFilter === "" || 
          (gradeFilter === "A/L" && subject.subjectid.startsWith("AL")) ||
          (gradeFilter === "O/L" && subject.subjectid.startsWith("OL")))
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
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Registered Classes</h4>
      </div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by subject"
          value={subjectFilter}
          onChange={handleSubjectFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by teacher name"
          value={teacherFilter}
          onChange={handleTeacherFilterChange}
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
            {getVisibleSubjects().map((dataItem) => (
              <tr key={dataItem.subjectid}>
                <td>{dataItem.subjectid}</td>
                <td>{dataItem.subjectname}</td>
                <td>{dataItem.teacher ? dataItem.teacher.teachername : ''}</td>
                <td>{dataItem.medium}</td>
                <td>
                  <div className="dt-status">
                    <span className="dt-status-text">{dataItem.day}  {dataItem.timeRange}</span>
                  </div>
                </td>
                <td className="dt-cell-action">
                  <Button onClick={() => navigate(`/classes/${dataItem.subjectid}`)}>
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

export default ClassesAreaTable;
