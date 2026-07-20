import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltip } from "../data/dashboardData";

export default function PerformanceChart({ data, height = 255 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 15, right: 8, bottom: 0, left: -25 }}
      >
        <CartesianGrid vertical={false} stroke="#edf0f3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#8b95a5", fontSize: 12 }}
        />
        <YAxis
          domain={[60, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#8b95a5", fontSize: 11 }}
        />
        <Tooltip contentStyle={chartTooltip} />
        <Line
          type="monotone"
          dataKey="productivity"
          name="Productivité"
          stroke="#e96a4b"
          strokeWidth={3}
          dot={height > 240 ? { r: 3, fill: "#e96a4b" } : false}
        />
        <Line
          type="monotone"
          dataKey="quality"
          name="Qualité"
          stroke="#2d8c89"
          strokeWidth={3}
          dot={height > 240 ? { r: 3, fill: "#2d8c89" } : false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
