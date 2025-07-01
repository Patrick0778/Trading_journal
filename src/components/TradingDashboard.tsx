import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "./PerformanceChart";
import { TradingStats, MT5Stats } from "./TradingStats";
import { AccountSelector } from "./AccountSelector";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const TradingDashboard = () => {
  const { signOut } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [mt5Creds, setMt5Creds] = useState({
    server: "",
    login: "",
    password: "",
  });
  const [stats, setStats] = useState<MT5Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMt5Creds({ ...mt5Creds, [e.target.name]: e.target.value });
  };

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/mt5/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mt5Creds),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setStats(data);
    } catch (err) {
      setError("Failed to fetch MT5 data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0F0F0" }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ backgroundColor: "#FEFEFE", borderColor: "#113E21" }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: "#113E21" }}>
            Trading Analytics Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <AccountSelector />
            <Button
              variant="outline"
              onClick={signOut}
              className="flex items-center gap-2"
              style={{ borderColor: "#B38B59", color: "#B38B59" }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* MT5 Credentials Form */}
        <Card className="mb-6" style={{ backgroundColor: "#FEFEFE" }}>
          <CardHeader>
            <CardTitle style={{ color: "#113E21" }}>Connect to MT5</CardTitle>
            <CardDescription>
              Enter your MT5 credentials to fetch trading analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                className="border p-2 rounded"
                style={{ borderColor: "#B38B59" }}
                type="text"
                name="server"
                placeholder="Server"
                value={mt5Creds.server}
                onChange={handleChange}
              />
              <input
                className="border p-2 rounded"
                style={{ borderColor: "#B38B59" }}
                type="text"
                name="login"
                placeholder="Login"
                value={mt5Creds.login}
                onChange={handleChange}
              />
              <input
                className="border p-2 rounded"
                style={{ borderColor: "#B38B59" }}
                type="password"
                name="password"
                placeholder="Password"
                value={mt5Creds.password}
                onChange={handleChange}
              />
              <Button
                style={{ backgroundColor: "#B38B59", color: "#FEFEFE" }}
                onClick={fetchStats}
                disabled={loading}
              >
                {loading ? "Loading..." : "Fetch Analytics"}
              </Button>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </CardContent>
        </Card>

        {/* Period Selection */}
        <Card className="mb-6" style={{ backgroundColor: "#FEFEFE" }}>
          <CardHeader>
            <CardTitle style={{ color: "#113E21" }}>
              Time Period Analysis
            </CardTitle>
            <CardDescription>
              Select a time period to analyze your trading performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="daily" style={{ color: "#113E21" }}>
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" style={{ color: "#113E21" }}>
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" style={{ color: "#113E21" }}>
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="annual" style={{ color: "#113E21" }}>
                  Annual
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="mb-6" style={{ backgroundColor: "#FEFEFE" }}>
          <CardHeader>
            <CardTitle style={{ color: "#113E21" }}>
              Performance Chart
            </CardTitle>
            <CardDescription>Return percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart period={selectedPeriod} stats={stats} />
          </CardContent>
        </Card>

        {/* Trading Statistics */}
        <TradingStats stats={stats} />
      </div>
    </div>
  );
};

export default TradingDashboard;
