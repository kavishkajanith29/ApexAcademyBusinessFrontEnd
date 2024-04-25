import {TeacherTop, TeacherTable,RegistrationForm } from "../../studentcomponents";

const StudentTeachers = () => {
  return (
    <div className="content-area">
      <TeacherTop />
      <RegistrationForm/>
      <TeacherTable/>
    </div>
  );
};

export default StudentTeachers;
