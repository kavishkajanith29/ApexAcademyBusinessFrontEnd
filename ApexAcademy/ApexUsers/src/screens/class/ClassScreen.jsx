import { Attendance, ClassForm, ClassTable, ClassTableMarks, ClassTop, PieChartMarks } from "../../components";


const Class = () => {
  return (
    <div className="content-area">
      <ClassTop/>
      <ClassForm/>
      <ClassTable/>
      <ClassTableMarks/>
      <PieChartMarks/>
      <Attendance/>
    </div>
  );
};

export default Class;
