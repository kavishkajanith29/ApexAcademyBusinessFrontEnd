import React, { useState, useEffect } from 'react';

const AreaProgressChart = () => {
  const [classesData, setClassesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/v1/subject/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClassesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getCurrentDayOfWeek = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];

    return dayOfWeek;
  };

  const currentDay = getCurrentDayOfWeek();

  const filteredClasses = classesData.filter((item) => {
    return item.day === currentDay;
  });

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Today's Classes</h4>
      </div>
      <div className="progress-bar-list">
        {filteredClasses?.map((Classes) => (
          <div className="progress-bar-item" key={Classes.subjectid}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{Classes.subjectid}</p>
              <p className="bar-item-info-value light-green">
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
