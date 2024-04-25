const data = [
    {
      id: 1,
      name: "Today Class Cancled",
      date_time: "03-02-24,08.00h",
    },
    {
      id: 2,
      name: "Exam Result Uploaded",
      date_time: "03-02-24,08.00h",
    },
    {
      id: 3,
      name: "Today Class Postponend",
      date_time: "03-02-24,08.00h",
    },
    {
      id: 4,
      name: "Tomorrow has a Your Exam",
      date_time: "03-02-24,08.00h",
    },
    {
      id: 5,
      name: "Good Luck for Exam",
      date_time: "03-02-24,08.00h",
    },
  ];
  
  const AreaProgressChart = () => {
    return (
      <div className="progress-bar">
        <div className="progress-bar-info">
          <h4 className="progress-bar-title">Notification about the Class</h4>
        </div>
        <div className="progress-bar-list">
          {data?.map((progressbar) => {
            return (
              <div className="progress-bar-item" key={progressbar.id}>
                <div className="bar-item-info">
                  <p className="bar-item-info-name-class">{progressbar.name}</p>
                  <p className="bar-item-info-value-class">
                    {progressbar.date_time }
                  </p>
                </div>
                <div className="bar-item-full">
                  {/* <div
                    // className="bar-item-filled"
                    // style={{
                    // //   width: `${progressbar.percentValues}%`,
                    // }}
                  ></div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default AreaProgressChart;
  