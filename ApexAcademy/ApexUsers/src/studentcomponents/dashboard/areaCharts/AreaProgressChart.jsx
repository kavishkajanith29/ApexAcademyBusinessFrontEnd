const data = [
    {
      id: 1,
      name: "CHEMISTRY-ENGLISH-G12-003",
      percentValues: 90,
    },
    {
      id: 2,
      name: "ICT-SINHALA-G10-001",
      percentValues: 65,
    },
    {
      id: 3,
      name: "ICT-ENGLISH-G13-004",
      percentValues: 75,
    },
    {
      id: 4,
      name: "BIOLOGY-SINHALA-G12-005",
      percentValues: 80,
    },
    {
      id: 5,
      name: "MATHEMATICS-SINAHALA-G09-002",
      percentValues: 70,
    },
  ];
  
  const AreaProgressChart = () => {
    return (
      <div className="progress-bar">
        <div className="progress-bar-info">
          <h4 className="progress-bar-title">Attendance of Today Classes</h4>
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
  