import { EnrollTable, StudentEnrollForm, StudentEnrollTop, StudentsEnrollTable } from "../../components";

const Enroll = () => {
  return (
    <div className="content-area">
        <StudentEnrollTop/>
        <StudentsEnrollTable/>
        <StudentEnrollForm/>
        <EnrollTable/>
    </div>
  );
};

export default Enroll;
