
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceChart } from './PerformanceChart';
import { TradingStats } from './TradingStats';
import { AccountSelector } from './AccountSelector';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Plus } from 'lucide-react';

const TradingDashboard = () => {
  const { signOut } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F0F0' }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: '#FEFEFE', borderColor: '#113E21' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#113E21' }}>
            Trading Analytics Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <AccountSelector />
            <Button
              variant="outline"
              onClick={signOut}
              className="flex items-center gap-2"
              style={{ borderColor: '#B38B59', color: '#B38B59' }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Period Selection */}
        <Card className="mb-6" style={{ backgroundColor: '#FEFEFE' }}>
          <CardHeader>
            <CardTitle style={{ color: '#113E21' }}>Time Period Analysis</CardTitle>
            <CardDescription>Select a time period to analyze your trading performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="daily" style={{ color: '#113E21' }}>Daily</TabsTrigger>
                <TabsTrigger value="weekly" style={{ color: '#113E21' }}>Weekly</TabsTrigger>
                <TabsTrigger value="monthly" style={{ color: '#113E21' }}>Monthly</TabsTrigger>
                <TabsTrigger value="annual" style={{ color: '#113E21' }}>Annual</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="mb-6" style={{ backgroundColor: '#FEFEFE' }}>
          <CardHeader>
            <CardTitle style={{ color: '#113E21' }}>Performance Chart</CardTitle>
            <CardDescription>Return percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart period={selectedPeriod} />
          </CardContent>
        </Card>

        {/* Trading Statistics */}
        <TradingStats />
      </div>
    </div>
  );
};

export default TradingDashboard;
