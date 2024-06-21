import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaChartsClass.scss";
import { useEffect, useState } from "react";


const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [markDetails, setMarkDetails] = useState([]);
  const studentId = localStorage.getItem("studentId")
  const [averageMark, setAverageMark] = useState(0);

  useEffect(() => {
    const fetchMark = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/mark/student/${studentId}`);
        if (response.ok) {
          const data = await response.json();
          //setMarkDetails(data);
          console.log(data);
          console.log("marks");
          const monthMap = new Map();
          // Initialize monthMap with all months set to 0
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          months.forEach(month => monthMap.set(month, 0));

          // Populate monthMap with actual data
          data.forEach(item => {
            const month = new Date(item.exam.examDate).toLocaleString("default", { month: "short" });
            monthMap.set(month, item.mark);
          });

          // Convert monthMap to an array suitable for recharts
          const processedData = Array.from(monthMap, ([month, Marks]) => ({ month, Marks }));
          setMarkDetails(processedData);

           // Calculate the average mark
           const totalMarks = data.reduce((sum, item) => sum + item.mark, 0);
           const average = data.length > 0 ? totalMarks / data.length : 0;
           setAverageMark(average.toFixed(2));
        } else {
          console.error("Failed to fetch student mark");
        }
      } catch (error) {
        console.error("Error fetching student mark:", error);
      }
    };
    fetchMark();
  }, []);

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
        <h5 className="bar-chart-title">Exam Marks <br/><br/> Your Average Mark: {averageMark}</h5>
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
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
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
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
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
          {/* <div className="info-data-value">
            Your Average Mark: {averageMark}
          </div> */}
          
        </ResponsiveContainer>
        
      </div>
    </div>
  );
};

export default AreaBarChart;
