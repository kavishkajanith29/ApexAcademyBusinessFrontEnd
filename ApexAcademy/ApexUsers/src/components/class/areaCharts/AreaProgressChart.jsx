const data = [
    {
      id: 1,
      name: "Grade 6 - English",
      percentValues: 90,
    },
    {
      id: 2,
      name: "Grade 7 - English",
      percentValues: 65,
    },
    {
      id: 3,
      name: "Grade 8 - English",
      percentValues: 75,
    },
    {
      id: 4,
      name: "Grade 9 - English",
      percentValues: 80,
    },
    {
      id: 5,
      name: "Grade 10 - English",
      percentValues: 70,
    },
  ];
  
  const AreaProgressChart = () => {
    return (
      <div className="progress-bar">
        <div className="progress-bar-info">
          <h4 className="progress-bar-title">Student Attendance of Classes (Monthly)</h4>
        </div>
        <div className="progress-bar-list">
          {data?.map((progressbar) => {
            return (
              <div className="progress-bar-item" key={progressbar.id}>
                <div className="bar-item-info">
                  <p className="bar-item-info-name">{progressbar.name}</p>
                  <p className="bar-item-info-value">
                    {progressbar.percentValues }%
                  </p>
                </div>
                <div className="bar-item-full">
                  <div
                    className="bar-item-filled"
                    style={{
                      width: `${progressbar.percentValues}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default AreaProgressChart;
  