import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

export interface MT5Stats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  averageLotSize: number;
  totalLots: number;
  pipsGained: number;
  pipsLost: number;
  bestTrade: number;
  worstTrade: number;
  bestTradeReturnPercent: number;
  bestTradeReturnUSD: number;
  buyTrades: number;
  sellTrades: number;
  buyProfit: number;
  sellProfit: number;
  deposits: number;
  withdrawals: number;
  currency: string;
}

interface TradingStatsProps {
  stats?: MT5Stats;
}

export const TradingStats = ({ stats }: TradingStatsProps) => {
  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        Trading statistics will appear here after connecting to MT5.
      </div>
    );
  }

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return "0";
    return value.toLocaleString();
  };

  const formatCurrency = (value: number | undefined | null): string => {
    const prefix = stats.currency ? `${stats.currency} ` : "$";
    return `${prefix}${formatNumber(value)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Win Rate */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Win Rate
          </CardTitle>
          <Target className="h-4 w-4" style={{ color: "#B38B59" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#113E21" }}>
            {formatNumber(stats.winRate)}%
          </div>
          <Progress value={stats.winRate ?? 0} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {formatNumber(stats.winningTrades)} wins /{" "}
            {formatNumber(stats.totalTrades)} total
          </p>
        </CardContent>
      </Card>

      {/* Net Profit */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Net Profit
          </CardTitle>
          <DollarSign className="h-4 w-4" style={{ color: "#B38B59" }} />
        </CardHeader>
        <CardContent>
          <div
            className="text-2xl font-bold"
            style={{
              color: (stats.netProfit ?? 0) > 0 ? "#113E21" : "#dc2626",
            }}
          >
            {formatCurrency(stats.netProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            +{formatCurrency(stats.totalProfit)} /{" "}
            {formatCurrency(Math.abs(stats.totalLoss ?? 0))}
          </p>
        </CardContent>
      </Card>

      {/* Best Trade */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Best Trade
          </CardTitle>
          <TrendingUp className="h-4 w-4" style={{ color: "#B38B59" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#113E21" }}>
            {formatCurrency(stats.bestTrade)}
          </div>
          <p className="text-xs text-muted-foreground">
            Single best performing trade
          </p>
        </CardContent>
      </Card>

      {/* Worst Trade */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Worst Trade
          </CardTitle>
          <TrendingDown className="h-4 w-4" style={{ color: "#dc2626" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#dc2626" }}>
            {formatCurrency(stats.worstTrade)}
          </div>
          <p className="text-xs text-muted-foreground">
            Single worst performing trade
          </p>
        </CardContent>
      </Card>

      {/* Max Consecutive Wins */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Max Consecutive Wins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#113E21" }}>
            {formatNumber(stats.maxConsecutiveWins)}
          </div>
          <p className="text-xs text-muted-foreground">
            Longest winning streak
          </p>
        </CardContent>
      </Card>

      {/* Max Consecutive Losses */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Max Consecutive Losses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#dc2626" }}>
            {formatNumber(stats.maxConsecutiveLosses)}
          </div>
          <p className="text-xs text-muted-foreground">Longest losing streak</p>
        </CardContent>
      </Card>

      {/* Average Lot Size */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Average Lot Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#113E21" }}>
            {formatNumber(stats.averageLotSize)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average size per trade
          </p>
        </CardContent>
      </Card>

      {/* Total Lots */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Total Lots Traded
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#113E21" }}>
            {formatNumber(stats.totalLots)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total: {formatNumber(stats.totalLots)} lots
          </p>
        </CardContent>
      </Card>

      {/* Pips Analysis */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Pips Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#113E21" }}>
                Gained:
              </span>
              <span className="font-bold" style={{ color: "#113E21" }}>
                +{formatNumber(stats.pipsGained)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#113E21" }}>
                Lost:
              </span>
              <span className="font-bold" style={{ color: "#dc2626" }}>
                {formatNumber(stats.pipsLost)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span
                className="text-sm font-medium"
                style={{ color: "#113E21" }}
              >
                Net:
              </span>
              <span className="font-bold" style={{ color: "#113E21" }}>
                +{formatNumber(stats.pipsGained + Math.abs(stats.pipsLost))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buy/Sell Trades */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Buy/Sell Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span style={{ color: "#113E21" }}>
              Buy Trades: <b>{formatNumber(stats.buyTrades)}</b> (
              {formatCurrency(stats.buyProfit)})
            </span>
            <span style={{ color: "#113E21" }}>
              Sell Trades: <b>{formatNumber(stats.sellTrades)}</b> (
              {formatCurrency(stats.sellProfit)})
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Deposits/Withdrawals */}
      <Card style={{ backgroundColor: "#FEFEFE" }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: "#113E21" }}
          >
            Deposits / Withdrawals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span style={{ color: "#113E21" }}>
              Deposits: <b>{formatCurrency(stats.deposits)}</b>
            </span>
            <span style={{ color: "#113E21" }}>
              Withdrawals: <b>{formatCurrency(stats.withdrawals)}</b>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
