import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  labels: string[];
  data: number[];
}

const DonutChart: React.FC<DonutChartProps> = ({ labels, data }) => {
  return (
    <div style={{ maxWidth: 400, margin: "32px auto" }}>
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#C9CBCF",
              ],
            },
          ],
        }}
        options={{
          plugins: {
            legend: { position: "bottom" },
          },
        }}
      />
    </div>
  );
};

export default DonutChart; 