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
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  // Initialize an array to hold the aggregated data
  const aggregatedData = months.map(month => ({ month, amount: 0 }));

  // Aggregate data by month
  let totalAmount = 0;
  fees.forEach(fee => {
    const feeDate = new Date(fee.month);
    const monthIndex = feeDate.getMonth();
    const feeAmount = parseFloat(fee.amount);
    aggregatedData[monthIndex].amount += feeAmount;
    totalAmount += feeAmount;
  });

  return { aggregatedData, totalAmount };
};

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8085/api/v1/fees/all");
        let filteredFees = response.data;

        // Filter fees based on selected year
        if (selectedYear) {
          filteredFees = filteredFees.filter(fee => new Date(fee.month).getFullYear() === selectedYear);
          console.log("Filtered Fees by Year:", filteredFees); // Log the filtered fees
        }

        // Filter fees based on selected month
        if (selectedMonth) {
          filteredFees = filteredFees.filter(fee => new Date(fee.month).getMonth() === selectedMonth - 1);
          console.log("Filtered Fees by Month:", filteredFees); // Log the filtered fees
        }

        setFees(filteredFees);
      } catch (error) {
        console.error("Error fetching the fees data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  // Memoize the processed data to avoid recalculating on every render
  const { aggregatedData, totalAmount: calculatedTotalAmount } = useMemo(() => {
    const result = preprocessData(fees);
    console.log("Aggregated Data:", result.aggregatedData); // Log the aggregated data
    return result;
  }, [fees]);

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

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    console.log("Selected Year:", selectedYear); // Log the selected year
    setSelectedYear(selectedYear);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    console.log("Selected Month:", selectedMonth); // Log the selected month
    setSelectedMonth(selectedMonth);
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = [
    { value: "", label: "All" },
    { value: 1, label: "Jan" }, { value: 2, label: "Feb" }, { value: 3, label: "Mar" },
    { value: 4, label: "Apr" }, { value: 5, label: "May" }, { value: 6, label: "Jun" },
    { value: 7, label: "Jul" }, { value: 8, label: "Aug" }, { value: 9, label: "Sep" },
    { value: 10, label: "Oct" }, { value: 11, label: "Nov" }, { value: 12, label: "Dec" }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Revenue From Class Fees</h5>
        <div className="filter-container">
          <select value={selectedYear} onChange={handleYearChange}>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
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
                fill: "#676767",
                fontSize: 14,
              }}
            />
            <YAxis
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
