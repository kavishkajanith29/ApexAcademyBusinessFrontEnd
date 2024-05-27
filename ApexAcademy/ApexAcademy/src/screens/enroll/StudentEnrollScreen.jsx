import { StudentEnrollForm, StudentEnrollTop, StudentsEnrollTable } from "../../components";

const Enroll = () => {
  return (
    <div className="content-area">
        <StudentEnrollTop/>
        <StudentsEnrollTable/>
        <StudentEnrollForm/>
    </div>
  );
};

export default Enroll;
