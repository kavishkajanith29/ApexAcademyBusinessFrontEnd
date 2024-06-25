import { useContext, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ThemeContext } from "../../../context/ThemeContext";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaChartsClass.scss";
import { useParams } from "react-router-dom";

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [markDetails, setMarkDetails] = useState([]);
  const { subjectId, studentId } = useParams(); 
  const [averageMark, setAverageMark] = useState(0);

  useEffect(() => {
    const fetchMark = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/mark/student/${studentId}`);
        if (response.ok) {
          const data = await response.json();
          const monthMap = new Map();
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          months.forEach(month => monthMap.set(month, 0));

          const filteredData = data.filter(item => item.exam.subject.subjectid === subjectId);
          
          filteredData.forEach(item => {
            const month = new Date(item.exam.examDate).toLocaleString("default", { month: "short" });
            monthMap.set(month, item.mark);
          });

          const processedData = Array.from(monthMap, ([month, Marks]) => ({ month, Marks }));
          setMarkDetails(processedData);

          const totalMarks = filteredData.reduce((sum, item) => sum + item.mark, 0);
          const average = filteredData.length > 0 ? totalMarks / filteredData.length : 0;
          setAverageMark(average.toFixed(2));
        } else {
          console.error("Failed to fetch student marks");
        }
      } catch (error) {
        console.error("Error fetching student marks:", error);
      }
    };
    fetchMark();
  }, [studentId, subjectId]);

  const formatTooltipValue = (value) => {
    return `${value}`;
  };

  const formatYAxisLabel = (value) => {
    return `${value}`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart-class">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Exam Marks <br/><br/> Average Mark: {averageMark}</h5>
        <div className="chart-info-data">
          <div className="info-data-value"></div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={markDetails}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: "#676767",
                fontSize: 14,
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: "#676767",
              }}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="Marks"
              fill="#475be8"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
