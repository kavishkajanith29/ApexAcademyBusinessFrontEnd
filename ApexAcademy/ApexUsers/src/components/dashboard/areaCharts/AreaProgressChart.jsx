import { useState, useEffect } from 'react';

const AreaProgressChart = () => {
  const [classesData, setClassesData] = useState([]);
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/v1/subject/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Filter data by teacherId
        const filteredData = data.filter(subject => subject.teacher.teacherid === teacherId);
        setClassesData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teacherId]);

  const getCurrentDayOfWeek = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];

    return dayOfWeek;
  };

  const parseTimeRange = (timeRange) => {
    const [startTime] = timeRange.split('-').map(time => time.trim());
    const [hours, minutes] = startTime.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const currentDay = getCurrentDayOfWeek();

  const filteredClasses = classesData
    .filter(item => item.day === currentDay)
    .sort((a, b) => parseTimeRange(a.timeRange) - parseTimeRange(b.timeRange));

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Today Classes</h4>
      </div>
      <div className="progress-bar-list">
        {filteredClasses?.map(Classes => (
          <div className="progress-bar-item" key={Classes.subjectid}>
            <div className="bar-item-info">
              <p className="bar-item-info-name" style={{fontWeight: "600",fontSize: "16px"}}>{Classes.subjectid}</p>
              <p className="bar-item-info-value" style={{color:"#54cc1f",fontWeight: "600",fontSize: "16px"}}>
                {Classes.timeRange}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;
