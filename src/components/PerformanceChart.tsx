
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  period: string;
}

// Mock data - this would come from your MT4/MT5 API
const generateMockData = (period: string) => {
  const baseData = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      profit: Math.random() * 1000 - 500,
      return: (Math.random() - 0.5) * 10,
    })),
    weekly: Array.from({ length: 12 }, (_, i) => ({
      name: `Week ${i + 1}`,
      profit: Math.random() * 5000 - 2500,
      return: (Math.random() - 0.5) * 20,
    })),
    monthly: Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      profit: Math.random() * 15000 - 7500,
      return: (Math.random() - 0.5) * 30,
    })),
    annual: Array.from({ length: 5 }, (_, i) => ({
      name: `Year ${2020 + i}`,
      profit: Math.random() * 50000 - 25000,
      return: (Math.random() - 0.5) * 50,
    })),
  };

  return baseData[period as keyof typeof baseData] || baseData.monthly;
};

export const PerformanceChart = ({ period }: PerformanceChartProps) => {
  const data = generateMockData(period);

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
          <XAxis dataKey="name" stroke="#113E21" />
          <YAxis stroke="#113E21" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FEFEFE', 
              border: '1px solid #B38B59',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="return" 
            stroke="#B38B59" 
            strokeWidth={3}
            name="Return %" 
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#113E21" 
            strokeWidth={2}
            name="Profit/Loss" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
