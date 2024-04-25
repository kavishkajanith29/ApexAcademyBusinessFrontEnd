const data = [
  {
    id: 1,
    name: "OL-EN-EN-01-2026",
    percentValues: "08.00-10.00",
  },
  {
    id: 2,
    name: "OL-EN-EN-01-2027",
    percentValues: "10.00-12.00",
  },
  {
    id: 3,
    name: "OL-SCI-SIN-03-2028",
    percentValues: "08.00-10.00",
  },
  {
    id: 4,
    name: "AL-CHE-SIN-02-2026",
    percentValues: "13.00-15.00",
  },
  {
    id: 5,
    name: "AL-MATH-SIN-04-2026",
    percentValues: "13.00-15.00",
  },
];

const AreaProgressChart = () => {
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Today Classes</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar) => {
          return (
            <div className="progress-bar-item" key={progressbar.id}>
              <div className="bar-item-info">
                <p className="bar-item-info-name">{progressbar.name}</p>
                <p className="bar-item-info-value light-green">
                  {progressbar.percentValues }
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AreaProgressChart;
