import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState} from "react";
import axios from "axios";
import { useNavigate , useParams } from "react-router-dom";

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Exam Date",
  "Email",
  "Phone Number",
  "Marks",
  //"View",
];

const AreaTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [studentFilter, setStudentFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [markFilter, setMarkFilter] = useState([]);

  
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
        console.log(filteredMarksDetails);
        console.log("hereallmark")
      } catch (error) {
        console.error("Error fetching marksdetails:", error);
      }
    };

    fetchMarksDetails();
  }, []);

  const totalPages = Math.ceil(markFilter.length / itemsPerPage);

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

  const handleStudentFilterChange = (e) => {
    const formattedValue = capitalizeWords(e.target.value);
    setStudentFilter(formattedValue);
  };

  const getFilteredMarks = () => {
    return markFilter.filter((teacher) => {
      return (
        // (studentFilter === "" || teacher.student.studentid.toLowerCase().includes(studentFilter.toLowerCase())) &&
        (monthFilter === "" || new Date(teacher.exam.examDate).toLocaleString('default', { month: 'long' }).includes(monthFilter))
      );
    });
  };

  const getVisibleMarks = () => {
    const filteredMarks = getFilteredMarks();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredMarks.length);
    return filteredMarks.slice(startIndex, endIndex);
  };

  // const getUniqueValues = (key) => {
  //   return [...new Set(teachers.map((teacher) => teacher[key]))];
  // };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Registered Student's Marks</h4>
      </div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Student ID"
          value={studentFilter}
          onChange={handleStudentFilterChange}
        />
        {/* <select value={mediumFilter} onChange={(e) => setMediumFilter(e.target.value)}>
          <option value="">All Mediums</option>
          {getUniqueValues('medium').map((medium) => (
            <option key={medium} value={medium}>
              {medium}
            </option>
          ))}
        </select> */}
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Month</option>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
            ))}
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
            {getVisibleMarks().map((dataItem) => (
              <tr key={dataItem.student.studentid}>
                <td>{dataItem.student.studentid}</td>
                <td>{dataItem.student.studentname}</td>
                <td>{dataItem.exam.examDate}</td>
                <td>{dataItem.student.email}</td>
                <td>{dataItem.student.phonenumber}</td>
                <td>{dataItem.mark}</td>
                {/* <td>
                  <div className="dt-status">
                    <span className="dt-status-text">{dataItem.email}</span>
                  </div>
                </td>
                <td className="dt-cell-action">
                  <Button onClick={() => navigate(`/teachers/${dataItem.teacherid}`)}>
                    View
                  </Button>
                </td> */}
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
