import {StudentsRegistrationForm, StudentTop, AreaTable, StudentForm} from "../../components";

const Students = () => {
  return (
    <div className="content-area">
      <StudentTop/>
      <StudentsRegistrationForm/>
      <AreaTable/>
      <StudentForm/>
    </div>
  );
};

export default Students;
