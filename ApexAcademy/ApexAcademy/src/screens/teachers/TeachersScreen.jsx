import {TeacherTop, TeacherTable,TeachersForm, RegistrationForm } from "../../components";

const Teachers = () => {
  return (
    <div className="content-area">
      <TeacherTop />
      <RegistrationForm/>
      <TeacherTable/>
      <TeachersForm/>
      
    </div>
  );
};

export default Teachers;
