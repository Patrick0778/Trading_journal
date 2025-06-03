
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

// Mock trading statistics - this would come from your MT4/MT5 API
const mockStats = {
  totalTrades: 245,
  winningTrades: 152,
  losingTrades: 93,
  winRate: 62.04,
  totalProfit: 15420.50,
  totalLoss: -8930.25,
  netProfit: 6490.25,
  maxConsecutiveWins: 12,
  maxConsecutiveLosses: 7,
  averageLotSize: 0.15,
  totalLots: 36.75,
  pipsGained: 2847,
  pipsLost: -1652,
  bestTrade: 890.75,
  worstTrade: -345.20,
  averageWin: 101.45,
  averageLoss: -95.98,
};

export const TradingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Win Rate */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Win Rate
          </CardTitle>
          <Target className="h-4 w-4" style={{ color: '#B38B59' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#113E21' }}>
            {mockStats.winRate}%
          </div>
          <Progress value={mockStats.winRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {mockStats.winningTrades} wins / {mockStats.totalTrades} total
          </p>
        </CardContent>
      </Card>

      {/* Net Profit */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Net Profit
          </CardTitle>
          <DollarSign className="h-4 w-4" style={{ color: '#B38B59' }} />
        </CardHeader>
        <CardContent>
          <div 
            className="text-2xl font-bold"
            style={{ color: mockStats.netProfit > 0 ? '#113E21' : '#dc2626' }}
          >
            ${mockStats.netProfit.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            +${mockStats.totalProfit.toLocaleString()} / ${Math.abs(mockStats.totalLoss).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Best Trade */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Best Trade
          </CardTitle>
          <TrendingUp className="h-4 w-4" style={{ color: '#B38B59' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#113E21' }}>
            ${mockStats.bestTrade}
          </div>
          <p className="text-xs text-muted-foreground">
            Single best performing trade
          </p>
        </CardContent>
      </Card>

      {/* Worst Trade */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Worst Trade
          </CardTitle>
          <TrendingDown className="h-4 w-4" style={{ color: '#dc2626' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#dc2626' }}>
            ${mockStats.worstTrade}
          </div>
          <p className="text-xs text-muted-foreground">
            Single worst performing trade
          </p>
        </CardContent>
      </Card>

      {/* Max Consecutive Wins */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Max Consecutive Wins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#113E21' }}>
            {mockStats.maxConsecutiveWins}
          </div>
          <p className="text-xs text-muted-foreground">
            Longest winning streak
          </p>
        </CardContent>
      </Card>

      {/* Max Consecutive Losses */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Max Consecutive Losses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#dc2626' }}>
            {mockStats.maxConsecutiveLosses}
          </div>
          <p className="text-xs text-muted-foreground">
            Longest losing streak
          </p>
        </CardContent>
      </Card>

      {/* Average Lot Size */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Average Lot Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#113E21' }}>
            {mockStats.averageLotSize}
          </div>
          <p className="text-xs text-muted-foreground">
            Total: {mockStats.totalLots} lots
          </p>
        </CardContent>
      </Card>

      {/* Pips Analysis */}
      <Card style={{ backgroundColor: '#FEFEFE' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: '#113E21' }}>
            Pips Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#113E21' }}>Gained:</span>
              <span className="font-bold" style={{ color: '#113E21' }}>+{mockStats.pipsGained}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#113E21' }}>Lost:</span>
              <span className="font-bold" style={{ color: '#dc2626' }}>{mockStats.pipsLost}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium" style={{ color: '#113E21' }}>Net:</span>
              <span className="font-bold" style={{ color: '#113E21' }}>
                +{mockStats.pipsGained + Math.abs(mockStats.pipsLost)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
