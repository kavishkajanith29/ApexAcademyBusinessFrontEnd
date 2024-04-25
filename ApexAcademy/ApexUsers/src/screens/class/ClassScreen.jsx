import { ClassForm, ClassTable, ClassTableMarks, ClassTop, PieChartMarks } from "../../components";


const Class = () => {
  return (
    <div className="content-area">
      <ClassTop/>
      <ClassForm/>
      <ClassTable/>
      <ClassTableMarks/>
      <PieChartMarks/>
    </div>
  );
};

export default Class;
