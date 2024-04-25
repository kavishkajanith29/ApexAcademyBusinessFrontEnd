import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Teacher ID",
  "Teacher Name",
  "Gender",
  "Address",
  "Email",
  "Phone Number",
  "Action",
];

const TABLE_DATA = [
  {
    id: 100,
    name: "OL-EN-EN-01",
    order_id: "Kamal Perera",
    date: "M",
    customer: "123 Main Street,Galle",
    status: "kamal.perera@gmail.com",
    amount: "+94771234567",
  },
  {
    id: 105,
    name: "OL-SCI-SIN-01",
    order_id: "Nimala Fernando",
    date: "F",
    customer: "456 Park Avenue, Matara",
    status: "nimala.fernando@gmail.com",
    amount: "+94762345678",
  },
];

const AreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Recently Registered Teachers</h4>
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

export default AreaTable;
