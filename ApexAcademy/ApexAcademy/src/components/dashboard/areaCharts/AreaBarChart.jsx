import { useContext, useEffect, useMemo, useState } from "react";
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
import { LIGHT_THEME } from "../../../constants/themeConstants";
import axios from "axios";
import "./AreaCharts.scss";

// Function to preprocess data and calculate total amount for the current year
const preprocessData = (fees) => {
  const currentYear = new Date().getFullYear();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  // Initialize an array to hold the aggregated data
  const aggregatedData = months.map(month => ({ month, amount: 0 }));

  // Aggregate data by month for the current year
  let totalAmount = 0;
  fees.forEach(fee => {
    const feeDate = new Date(fee.month);
    if (feeDate.getFullYear() === currentYear) {
      const monthIndex = feeDate.getMonth();
      const feeAmount = parseFloat(fee.amount);
      aggregatedData[monthIndex].amount += feeAmount;
      totalAmount += feeAmount;
    }
  });

  return { aggregatedData, totalAmount };
};

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/fees/all");
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching the fees data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize the processed data to avoid recalculating on every render
  const { aggregatedData, totalAmount: calculatedTotalAmount } = useMemo(() => preprocessData(fees), [fees]);

  useEffect(() => {
    setTotalAmount(calculatedTotalAmount);
  }, [calculatedTotalAmount]);

  const formatTooltipValue = (value) => {
    return `Rs.${value}`;
  };

  const formatYAxisLabel = (value) => {
    return `Rs.${value}`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Revenue From Class Fees</h5>
        <div className="chart-info-data">
          <div className="info-data-value">{`Rs.${totalAmount.toLocaleString()}`}</div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={aggregatedData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
            />
            <YAxis
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
              dataKey="amount"
              fill="#475be8"
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
