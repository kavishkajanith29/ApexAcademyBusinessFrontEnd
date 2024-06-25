import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { PieChart } from '@mui/x-charts/PieChart';
import '../pieChart/PieChart.scss';

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Exam Date",
  "Email",
  "Phone Number",
  "Marks",
  "View",
];

const AreaTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [studentFilter, setStudentFilter] = useState("");
  const [examDescriptionFilter, setExamDescriptionFilter] = useState("");
  const [examDescriptions, setExamDescriptions] = useState([]);
  const [marksRangeFilter, setMarksRangeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [markFilter, setMarkFilter] = useState([]);

  useEffect(() => {
    const fetchMarksDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/mark/all");
        const filteredMarksDetails = response.data.filter(enrollment => 
          enrollment.exam.subject.subjectid === id
        );
        setMarkFilter(filteredMarksDetails);
        const descriptions = Array.from(new Set(filteredMarksDetails.map(mark => mark.exam.description)));
        setExamDescriptions(descriptions);
      } catch (error) {
        console.error("Error fetching marks details:", error);
      }
    };

    fetchMarksDetails();
  }, [id]);

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

  const handleStudentFilterChange = (e) => {
    setStudentFilter(e.target.value);
  };

  const handleExamDescriptionFilterChange = (e) => {
    setExamDescriptionFilter(e.target.value);
  };

  const handleMarksRangeFilterChange = (e) => {
    setMarksRangeFilter(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const getFilteredMarks = () => {
    return markFilter.filter((mark) => {
      const matchesStudentFilter = studentFilter === "" || mark.student.studentid.toString().includes(studentFilter);
      const matchesExamDescriptionFilter = examDescriptionFilter === "" || mark.exam.description.includes(examDescriptionFilter);

      const matchesMarksRangeFilter = (() => {
        if (marksRangeFilter === "75-100") return mark.mark >= 75 && mark.mark <= 100;
        if (marksRangeFilter === "65-74") return mark.mark >= 65 && mark.mark < 75;
        if (marksRangeFilter === "55-64") return mark.mark >= 55 && mark.mark < 65;
        if (marksRangeFilter === "40-54") return mark.mark >= 40 && mark.mark < 55;
        if (marksRangeFilter === "0-39") return mark.mark >= 0 && mark.mark < 40;
        return true;
      })();

      return matchesStudentFilter && matchesExamDescriptionFilter && matchesMarksRangeFilter;
    });
  };

  const getVisibleMarks = () => {
    const filteredMarks = getFilteredMarks();

    if (sortOrder === "asc") {
      filteredMarks.sort((a, b) => a.mark - b.mark);
    } else {
      filteredMarks.sort((a, b) => b.mark - a.mark);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredMarks.length);
    return filteredMarks.slice(startIndex, endIndex);
  };

  const handleButtonClick = (studentId, subjectId) => {
    navigate(`/subject/${studentId}/${subjectId}`);
  };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Exam Marks</h4>
      </div>
      <div className="filter-container" style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Filter by Student ID"
          value={studentFilter}
          onChange={handleStudentFilterChange}
        />
        <select value={examDescriptionFilter} onChange={handleExamDescriptionFilterChange} style={{ marginLeft: 10, padding: 5 }}>
          <option value="">All Exams</option>
          {examDescriptions.map((description, index) => (
            <option key={index} value={description}>
              {description}
            </option>
          ))}
        </select>
        <select value={marksRangeFilter} onChange={handleMarksRangeFilterChange} style={{ marginLeft: 10, padding: 5 }}>
          <option value="">All Marks</option>
          <option value="75-100">Marks 75-100</option>
          <option value="65-74">Marks 65-74</option>
          <option value="55-64">Marks 55-64</option>
          <option value="40-54">Marks 40-54</option>
          <option value="0-39">Marks 0-39</option>
        </select>
        <select value={sortOrder} onChange={handleSortOrderChange} style={{ marginLeft: 10, padding: 5 }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
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
                <td className="dt-cell-action">
                <Button style={{ backgroundColor: "#007bff" }} onClick={() => handleButtonClick(dataItem.student.studentid, id)}>
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

      {/* Adding the Pie Chart Component */}
      <div className="pie-chart-container" style={{marginTop:25}}>
        <PieActiveArc />
      </div>
    </section>
  );
};

export default AreaTable;





function PieActiveArc() {
  const [data, setData] = useState([]);
  const [examDescriptionFilter, setExamDescriptionFilter] = useState('');
  const [examDescriptions, setExamDescriptions] = useState([]);
  const [averageMark, setAverageMark] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchMarksDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/mark/all');
        const filteredMarksDetails = response.data.filter(
          (enrollment) => enrollment.exam.subject.subjectid === id
        );
        const descriptions = Array.from(
          new Set(filteredMarksDetails.map((mark) => mark.exam.description))
        );
        setExamDescriptions(descriptions);

        // Apply the exam description filter
        const filteredByExamDescription = filteredMarksDetails.filter((enrollment) => {
          return examDescriptionFilter === '' || enrollment.exam.description === examDescriptionFilter;
        });

        updateChartData(filteredByExamDescription);
      } catch (error) {
        console.error('Error fetching marks details:', error);
      }
    };

    fetchMarksDetails();
  }, [id, examDescriptionFilter]);

  const updateChartData = (marksDetails) => {
    const counts = {
      '0-39': 0,
      '40-54': 0,
      '55-64': 0,
      '65-74': 0,
      '75-100': 0,
    };

    let totalMarks = 0;
    marksDetails.forEach((enrollment) => {
      const mark = enrollment.mark;
      totalMarks += mark;
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
    });

    const totalStudents = marksDetails.length;
    const average = totalStudents > 0 ? totalMarks / totalStudents : 0;
    setAverageMark(average);

    const pieData = [
      {
        id: 0,
        value: counts['75-100'],
        label: '75-100',
        color: '#FF5733',
        count: (counts['75-100'] / totalStudents) * 100,
      },
      {
        id: 1,
        value:  counts['65-74'],
        label: '65-74',
        color: '#FFC300',
        count: (counts['65-74'] / totalStudents) * 100,
      },
      {
        id: 2,
        value: counts['55-64'],
        label: '55-64',
        color: '#36A2EB',
        count: (counts['55-64'] / totalStudents) * 100,
      },
      {
        id: 3,
        value:  counts['40-54'],
        label: '40-54',
        color: '#4BC0C0',
        count: (counts['40-54'] / totalStudents) * 100,
      },
      {
        id: 4,
        value: counts['0-39'],
        label: '0-39',
        color: '#9966FF',
        count: (counts['0-39'] / totalStudents) * 100,
      },
    ];

    setData(pieData);
  };

  return (
    <div className='pie-chart-container'>
      <h4 className='data-table-title'>Overall results of students</h4>
      <select
        value={examDescriptionFilter}
        onChange={(e) => setExamDescriptionFilter(e.target.value)}
      >
        <option value=''>All</option>
        {examDescriptions.map((description) => (
          <option key={description} value={description}>
            {description}
          </option>
        ))}
      </select>
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            tooltip: {
              format: {
                title: (index) => data[index].label,
                value: (index) => data[index].count,
              },
            },
          },
        ]}
        height={200}
      />
      <div style={{ marginTop: '-190px' }}>
        <strong>Percentage Distribution:</strong>
        {/* <ul>
          {data.map((item) => (
            <li key={item.id}>
              <span style={{ marginRight: '8px', display: 'inline-block', width: '10px', height: '10px', backgroundColor: item.color }}></span>
              {item.label}: ({item.count.toFixed(2)}%) {(item.value)} 
            </li>
          ))}
        </ul> */}
        <table>
          
          <tbody>
    {data.map((item) => (
      <tr key={item.id}>
        <td>
          <span
            style={{
              marginRight: '8px',
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: item.color,
            }}
          ></span>
        </td>
        <td style={{paddingLeft:5}}>{item.label}</td>
        <td style={{paddingLeft:20}}>{averageMark === 0 ? 0 : item.count.toFixed(2)}%</td>
        <td style={{paddingLeft:20}}>({item.value})</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Average Mark:</strong> {averageMark.toFixed(2)}
      </div>
    </div>
  );
}