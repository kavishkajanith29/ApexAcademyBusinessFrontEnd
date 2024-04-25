import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Student ID",
  "Student Name",
  "Grade",
  "Gender",
  "Email",
  "Phone Number",
  "Action",
];

const TABLE_DATA = [
  {
    id: 100,
    student_id: "OL-2029-003",
    student_name: "Kasun Kumara",
    grade: "Grade 06",
    gender: "M",
    email: "kasunkumara@gmail.com",
    phone_number: "071-5687903",
  },
  {
    id: 101,
    student_id: "OL-2027-155",
    student_name:"Dilshan kumara",
    grade: "Grade 08",
    gender: "M",
    email: "dilshan@gmail.com",
    phone_number: "071-5687903",
  },
  {
    id: 102,
    student_id: "OL-2028-096",
    student_name: "Pasindu Kumara",
    grade: "Grade 07",
    gender: "M",
    email: "pasindu@gmail.com",
    phone_number: "071-5687903",
  },
  {
    id: 103,
    student_id: "OL-2027-156",
    student_name: "Amaya Githmi",
    grade: "Grade 08",
    gender: "F",
    email: "amaya@gmail.com",
    phone_number: "071-5687903",
  },
];

const AreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Recently Registered Students</h4>
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
                  <td>{dataItem.grade}</td>
                  <td>{dataItem.gender}</td>
                  <td>
                    <div className="dt-status">
                      {/* <span
                        className={`dt-status-dot dot-${dataItem.email}`}
                      ></span> */}
                      <span className="dt-status-text">{dataItem.email}</span>
                    </div>
                  </td>
                  <td>{dataItem.phone_number}</td>
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
