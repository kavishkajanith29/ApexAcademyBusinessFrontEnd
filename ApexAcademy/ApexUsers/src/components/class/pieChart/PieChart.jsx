import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './PieChart.scss';

const data = [
  { id: 0, value: 10, label: 'Marks 75-100' },
  { id: 1, value: 15, label: 'Marks 65-74' },
  { id: 2, value: 20, label: 'Marks 55-64' },
  { id: 3, value: 5, label: 'Marks 40-54' },
  { id: 4, value: 2, label: 'Marks 0-39' },
];

export default function PieActiveArc() {
  return (
    <div className= 'content-area-table'>
        <h4 className="data-table-title" >Average Result of Student</h4>
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
    </div>
  );
}