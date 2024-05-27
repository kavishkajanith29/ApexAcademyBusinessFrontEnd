import { ClassesAreaCard, ClassesAreaTable, ClassesForm } from "../../components";
import ClassesAreaTop from "../../components/classes/areaTop/ClassesAreaTop";

const Classes = () => {
  return (
    <div className="content-area">
      <ClassesAreaTop/>
      <ClassesAreaCard/>
      <ClassesAreaTable/>
      <ClassesForm/>
    </div>
  );
};

export default Classes;
