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

const data = [
  {
    month: "Jan",
    loss: 70,
    Marks: 100,
  },
  {
    month: "Feb",
    loss: 55,
    Marks: 85,
  },
  {
    month: "Mar",
    loss: 35,
    Marks: 90,
  },
  {
    month: "April",
    loss: 90,
    Marks: 70,
  },
  {
    month: "May",
    loss: 55,
    Marks: 80,
  },
  {
    month: "Jun",
    loss: 30,
    Marks: 50,
  },
  {
    month: "Jul",
    loss: 32,
    Marks: 75,
  },
  {
    month: "Aug",
    loss: 62,
    Marks: 86,
  },
  {
    month: "Sep",
    loss: 55,
    Marks: 78,
  },
];

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);

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
        <h5 className="bar-chart-title">Exam Marks</h5>
        <div className="chart-info-data">
          <div className="info-data-value"></div>
          <div className="info-data-text">
            <br/>
            {/* <FaArrowUpLong /> */}
            {/* <p>2% than last month.</p> */}
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={data}
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
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
