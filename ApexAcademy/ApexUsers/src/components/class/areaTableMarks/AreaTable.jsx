import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Gender",
  "Email",
  "Marks",
  "Action",
];

const TABLE_DATA = [
  {
    id: 100,
    student_id: "OL-2029-001",
    student_name: "Kasun Kumara",
    gender: "M",
    email: "kasunkumara@gmail.com",
    marks: 90,
  },
  {
    id: 101,
    student_id: "OL-2029-002",
    student_name:"Dilshan kumara",
    gender: "M",
    email: "dilshan@gmail.com",
    marks: 55,
  },
  {
    id: 102,
    student_id: "OL-2029-003",
    student_name: "Pasindu Kumara",
    gender: "M",
    email: "pasindu@gmail.com",
    marks: 80,
  },
];

const AreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Students Exam Marks - January</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA?.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.student_id}</td>
                  <td>{dataItem.student_name}</td>
                  
                  <td>{dataItem.gender}</td>
                  <td>
                    <div className="dt-status">
                      {/* <span
                        className={`dt-status-dot dot-${dataItem.email}`}
                      ></span> */}
                      <span className="dt-status-text">{dataItem.email}</span>
                    </div>
                  </td>
                  <td>{dataItem.marks}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
