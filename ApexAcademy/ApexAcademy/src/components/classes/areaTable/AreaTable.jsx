import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Class ID",
  "Teacher Name",
  "Medium",
  "Date",
  "Schedule Time",
  "Number of Students",
  "Action",
];

const TABLE_DATA = [
  {
    id: 100,
    name: "OL-EN-EN-01-2026",
    order_id: "Kamal Perera",
    date: "English",
    customer: "SATURDAY",
    status: "08.00-10.00",
    amount: "25",
  },
  {
    id: 105,
    name: "OL-SCI-SIN-01-2027",
    order_id: "Nimala Fernando",
    date: "Sinhala",
    customer: "FRIDAY",
    status: "16.00-18.00",
    amount: "215",
  },
];

const ClassesAreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Recently Registered Classes</h4>
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
                  <td>{dataItem.name}</td>
                  <td>{dataItem.order_id}</td>
                  <td>{dataItem.date}</td>
                  <td>{dataItem.customer}</td>
                  <td>
                    <div className="dt-status">
                      <span
                        className={`dt-status-dot dot-${dataItem.status}`}
                      ></span>
                      <span className="dt-status-text">{dataItem.status}</span>
                    </div>
                  </td>
                  <td>{dataItem.amount}</td>
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

export default ClassesAreaTable;
