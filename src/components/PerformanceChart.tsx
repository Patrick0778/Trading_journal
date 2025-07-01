import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MT5Stats } from "./TradingStats";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

interface PerformanceChartProps {
  period: string;
  stats?: MT5Stats;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to generate chart data from stats
const generateChartData = (period: string, stats?: MT5Stats) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  if (!stats) {
    // fallback to mock data
    if (period === "monthly") {
      // Generate data only up to the current month for the current year
      return months.slice(0, currentMonth + 1).map((month, i) => ({
        name: `${month} ${currentYear}`,
        value: Math.random() * 15000 - 7500,
        return: (Math.random() - 0.5) * 30,
      }));
    }

    const baseData = {
      daily: Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.random() * 1000 - 500,
        return: (Math.random() - 0.5) * 10,
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        name: `Week ${i + 1}`,
        value: Math.random() * 5000 - 2500,
        return: (Math.random() - 0.5) * 20,
      })),
      annual: Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - 4 + i;
        return {
          name: `${year}`,
          value: Math.random() * 50000 - 25000,
          return: (Math.random() - 0.5) * 50,
        };
      }),
    };
    return baseData[period as keyof typeof baseData] || baseData.daily;
  }

  // If stats available, create data array based on period
  if (period === "monthly") {
    return months.slice(0, currentMonth + 1).map((month, i) => ({
      name: `${month} ${currentYear}`,
      value: stats.netProfit,
      return: stats.winRate,
    }));
  }

  const points =
    period === "annual" ? 5 : period === "weekly" ? 12 : 30;

  return Array.from({ length: points }, (_, i) => ({
    name:
      period === "annual"
        ? `${currentYear - 4 + i}`
        : `${period.charAt(0).toUpperCase() + period.slice(1)} ${i + 1}`,
    value: stats.netProfit,
    return: stats.winRate,
  }));
};

export const PerformanceChart = ({ period, stats }: PerformanceChartProps) => {
  const { theme, toggleTheme } = useTheme();
  const data = generateChartData(period, stats);

  const isDark = theme === 'dark';
  const chartColors = {
    text: isDark ? '#ffffff' : '#113E21',
    line: isDark ? '#00ff88' : '#B38B59',
    grid: isDark ? '#333333' : '#F0F0F0',
    tooltip: {
      bg: isDark ? '#1a1a1a' : '#FEFEFE',
      border: isDark ? '#333333' : '#B38B59',
    }
  };

  return (
    <div className={`relative rounded-lg p-4 ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className={`${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="name"
              stroke={chartColors.text}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={chartColors.text}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltip.bg,
                border: `1px solid ${chartColors.tooltip.border}`,
                borderRadius: "8px",
                fontSize: '12px',
              }}
              labelStyle={{ color: chartColors.text }}
            />
            <Legend />
            <Line
              type="linear"
              dataKey="value"
              stroke={chartColors.line}
              name="Value"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="linear"
              dataKey="return"
              stroke={chartColors.text}
              name="Return %"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
