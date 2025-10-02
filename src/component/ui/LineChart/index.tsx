import React from "react";

type LineChartProps = {
  data: number[];            // e.g., prices over time
  width?: number;            // default 120
  height?: number;           // default 40
  strokeWidth?: number;      // default 2
  className?: string;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 120,
  height = 40,
  strokeWidth = 2,
  className = "",
}) => {
  if (!data || data.length < 2) return <svg width={width} height={height} className={className} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - strokeWidth) + strokeWidth / 2;
    const y = height - ((v - min) / range) * (height - strokeWidth) - strokeWidth / 2;
    return `${x},${y}`;
  }).join(" ");

  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? "#22C55E" : "#EF4444"; // green / red

  return (
    <svg width={width} height={height} className={className}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};

export default LineChart;