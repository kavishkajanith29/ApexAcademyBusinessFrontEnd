import { MdOutlineMenu } from "react-icons/md";
import "./AreaTop.scss";
import { useContext} from "react";
import { SidebarContext } from "../../../context/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [subjectDetails, setSubjectDetails] = useState({});
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/${id}`);
         setSubjectDetails(response.data);
         console.log(response.data)
        // console.log("Here")
        //  const filteredEnrollments = response.data.filter(enrollment => 
        //    enrollment.teacher.teacherid === teacherId
        //  );
        //  setEnrollments(filteredEnrollments);
        //  console.log(filteredEnrollments);
        console.log("Here11")
      } catch (error) {
        console.error('Error fetching enrollments', error);
      }
    };

    fetchEnrollments();
  }, [id]);

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">{subjectDetails.subjectid}</h2>
      </div>
    </section>
  );
};

export default AreaTop;
