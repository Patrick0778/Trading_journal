import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Trade {
  id: string;
  date: string;
  ticker: string;
  direction: string;
  entry: number;
  exit: number;
  size: number;
  pnl: number;
  notes: string;
  tags: string[];
  strategy: string;
  market_condition: string;
  instrument_type: string;
  win_loss: string;
  screenshot_url: string;
  created_at: string;
}

interface PerformanceChartProps {
  trades: Trade[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades }) => {
  // Calculate cumulative P&L for equity curve - ensure proper date sorting
  const equityCurveData = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade, index) => {
      const previousValue = acc.length > 0 ? acc[acc.length - 1].value : 0;
      const newValue = previousValue + (trade.pnl || 0);
      acc.push({
        date: new Date(trade.date).toLocaleDateString(),
        value: newValue,
        trade: index + 1,
      });
      return acc;
    }, [] as Array<{ date: string; value: number; trade: number }>);

  // Win/Loss distribution for pie chart
  const winLossData = [
    {
      name: "Wins",
      value: trades.filter((t) => (t.pnl || 0) > 0).length,
      color: "#10b981",
    },
    {
      name: "Losses",
      value: trades.filter((t) => (t.pnl || 0) < 0).length,
      color: "#ef4444",
    },
    {
      name: "Breakeven",
      value: trades.filter((t) => (t.pnl || 0) === 0).length,
      color: "#6b7280",
    },
  ];

  // Strategy performance
  const strategyData = trades.reduce((acc, trade) => {
    if (!trade.strategy) return acc;
    if (!acc[trade.strategy]) {
      acc[trade.strategy] = { strategy: trade.strategy, pnl: 0, count: 0 };
    }
    acc[trade.strategy].pnl += trade.pnl || 0;
    acc[trade.strategy].count += 1;
    return acc;
  }, {} as Record<string, { strategy: string; pnl: number; count: number }>);

  const strategyChartData = Object.values(strategyData).map((item) => ({
    strategy: item.strategy,
    pnl: item.pnl,
    count: item.count,
  }));

  // Monthly performance - ensure proper date handling
  const monthlyData = trades.reduce((acc, trade) => {
    try {
      const tradeDate = new Date(trade.date);
      if (isNaN(tradeDate.getTime())) return acc; // Skip invalid dates

      const month = tradeDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = { month, pnl: 0, trades: 0 };
      }
      acc[month].pnl += trade.pnl || 0;
      acc[month].trades += 1;
    } catch (e) {
      // Skip trades with invalid dates
    }
    return acc;
  }, {} as Record<string, { month: string; pnl: number; trades: number }>);

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => {
    try {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    } catch (e) {
      return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Equity Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>Cumulative P&L over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={equityCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Cumulative P&L",
                ]}
                labelFormatter={(label) => `Trade ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Distribution</CardTitle>
            <CardDescription>Breakdown of trade outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Trades"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strategy Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Strategy Performance</CardTitle>
            <CardDescription>P&L by trading strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={strategyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P&L"]}
                />
                <Bar dataKey="pnl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>P&L and trade count by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "pnl" ? `$${value.toFixed(2)}` : value,
                  name === "pnl" ? "P&L" : "Trades",
                ]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="pnl"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="P&L"
              />
              <Bar
                yAxisId="right"
                dataKey="trades"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Trades"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key trading statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {trades.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {trades.filter((t) => t.pnl > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Winning Trades
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {trades.filter((t) => t.pnl < 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Losing Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {trades.length > 0
                  ? (
                      (trades.filter((t) => t.pnl > 0).length / trades.length) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
