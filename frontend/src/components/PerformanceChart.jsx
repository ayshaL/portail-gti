import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltip } from "../data/dashboardData";

const defaultLines = [
  {
    dataKey: "productivity",
    name: "Productivité",
    stroke: "#e96a4b",
    yAxisId: "left",
  },
  {
    dataKey: "quality",
    name: "Qualité",
    variant: "dashed",
    stroke: "#2d8c89",
    yAxisId: "left",
  },
  {
    dataKey: "score",
    name: "Score",
    stroke: "#4b8de9",
    yAxisId: "left",
  },
];

const customYAxisTicks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function PerformanceChart({
  data,
  lines,
  referenceLines = [],
  height = 255,
}) {
  const chartLines = lines ?? defaultLines;
  const showRightAxis = chartLines.some((line) => line.yAxisId === "right");

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 15, right: 8, bottom: 0, left: -25 }}
      >
        <CartesianGrid horizontal={true} vertical={false} stroke="#edf0f3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#8b95a5", fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, "dataMax+10"]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#8b95a5", fontSize: 11 }}
        />
        {showRightAxis ? (
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, "dataMax"+10]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8b95a5", fontSize: 11 }}
          />
        ) : null}

        {referenceLines.map((line) => (
          <ReferenceLine
            key={line.y}
            y={line.y}
            yAxisId={line.yAxisId ?? "left"}
            stroke={line.stroke ?? "#d1d5db"}
            strokeDasharray={line.strokeDasharray ?? "2 2"}
            label={line.label}
          />
        ))}

        <Tooltip contentStyle={chartTooltip} />
        {chartLines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.stroke}
            yAxisId={line.yAxisId ?? "left"}
            strokeWidth={3}
            dot={height > 240 ? { r: 3, fill: line.stroke } : false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
