import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import PerformanceChart from "./PerformanceChart";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Upload,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Tag,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";

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

interface DashboardStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  averageRR: number;
}

// LocalStorage persistence helpers
const TRADES_STORAGE_KEY = "trading_analytics_trades";

function saveTradesToStorage(trades: Trade[]) {
  try {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
  } catch (err) {
    console.error("Error saving trades to storage:", err);
  }
}

function loadTradesFromStorage(): Trade[] {
  try {
    const raw = localStorage.getItem(TRADES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading trades from storage:", err);
  }
  return [];
}

const TradingDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [trades, setTrades] = useState<Trade[]>(() => loadTradesFromStorage());
  const [stats, setStats] = useState<DashboardStats>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0,
    averageRR: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStrategy, setFilterStrategy] = useState("all");
  const [filterWinLoss, setFilterWinLoss] = useState("all");
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    date: new Date().toISOString().split("T")[0],
    ticker: "",
    direction: "BUY",
    entry: 0,
    exit: 0,
    size: 0,
    pnl: 0,
    notes: "",
    tags: [],
    strategy: "",
    market_condition: "",
    instrument_type: "FOREX",
    win_loss: "WIN",
  });

  // Save trades to localStorage whenever they change
  useEffect(() => {
    saveTradesToStorage(trades);
  }, [trades]);

  const calculateStats = (tradesData: Trade[]) => {
    const totalTrades = tradesData.length;
    const winningTrades = tradesData.filter((t) => t.pnl > 0).length;
    const losingTrades = tradesData.filter((t) => t.pnl < 0).length;
    const totalProfit = tradesData
      .filter((t) => t.pnl > 0)
      .reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLoss = Math.abs(
      tradesData
        .filter((t) => t.pnl < 0)
        .reduce((sum, t) => sum + (t.pnl || 0), 0)
    );
    const netProfit = totalProfit - totalLoss;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    setStats({
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      averageRR: totalLoss > 0 ? totalProfit / totalLoss : 0,
    });
  };

  // Defensive addTrade (local only)
  const addTrade = () => {
    const trade: Trade = {
      id: `local-${Date.now()}`,
      date: newTrade.date || new Date().toISOString(),
      ticker: newTrade.ticker || "",
      direction: newTrade.direction || "BUY",
      entry: isNaN(Number(newTrade.entry)) ? 0 : Number(newTrade.entry),
      exit: isNaN(Number(newTrade.exit)) ? 0 : Number(newTrade.exit),
      size: isNaN(Number(newTrade.size)) ? 0 : Number(newTrade.size),
      pnl: isNaN(Number(newTrade.pnl)) ? 0 : Number(newTrade.pnl),
      notes: newTrade.notes || "",
      tags: newTrade.tags || [],
      strategy: newTrade.strategy || "",
      market_condition: newTrade.market_condition || "",
      instrument_type: newTrade.instrument_type || "FOREX",
      win_loss: newTrade.win_loss || "WIN",
      screenshot_url: newTrade.screenshot_url || "",
      created_at: new Date().toISOString(),
    };
    const updated = [trade, ...trades];
    setTrades(updated);
    calculateStats(updated);
    setShowAddTrade(false);
    setNewTrade({
      date: new Date().toISOString().split("T")[0],
      ticker: "",
      direction: "BUY",
      entry: 0,
      exit: 0,
      size: 0,
      pnl: 0,
      notes: "",
      tags: [],
      strategy: "",
      market_condition: "",
      instrument_type: "FOREX",
      win_loss: "WIN",
    });
    toast({
      title: "Success",
      description: "Trade added successfully",
    });
  };

  const uploadFile = async (file: File) => {
    try {
      let parsedTrades: Record<string, unknown>[] = [];
      if (file.type === "text/csv") {
        await new Promise<void>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              parsedTrades = (results.data as Record<string, unknown>[]).filter(
                (row) =>
                  row.ticker ||
                  row.Ticker ||
                  row.symbol ||
                  row.pnl ||
                  row.PnL ||
                  row.profit
              );
              resolve();
            },
            error: reject,
          });
        });
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedTrades = XLSX.utils.sheet_to_json(worksheet) as Record<
          string,
          unknown
        >[];
      } else if (file.type === "application/pdf") {
        const data = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text +=
            (content.items as { str: string }[])
              .map((item) => item.str)
              .join(" ") + "\n";
        }
        const lines = text.split("\n").filter(Boolean);
        if (lines.length > 1) {
          const csv = lines.join("\n");
          Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              parsedTrades = (results.data as Record<string, unknown>[]).filter(
                (row) =>
                  row.ticker ||
                  row.Ticker ||
                  row.symbol ||
                  row.pnl ||
                  row.PnL ||
                  row.profit
              );
            },
          });
        }
      }
      if (parsedTrades.length > 0) {
        const normalized: Trade[] = parsedTrades.map((row, i) => {
          // Defensive number parsing
          const safeParse = (v: unknown) => {
            const n = Number(v);
            return isNaN(n) ? 0 : n;
          };
          const pnl = safeParse(row.pnl || row.PnL || row.profit || row.Profit);
          const entry = safeParse(row.entry || row.Entry || row.ENTRY);
          const exit = safeParse(row.exit || row.Exit || row.EXIT);
          const size = safeParse(
            row.size || row.Size || row.volume || row.Volume
          );
          // Robust date parsing for Excel serials and strings
          let parsedDate = new Date();
          const dateRaw =
            row.date ||
            row.Date ||
            row.DATE ||
            row.timestamp ||
            row.Timestamp ||
            row.TradeDate;
          if (dateRaw) {
            if (!isNaN(Number(dateRaw)) && Number(dateRaw) > 1000) {
              parsedDate = new Date((Number(dateRaw) - 25569) * 86400 * 1000);
            } else if (typeof dateRaw === "string") {
              const tryFormats = [
                (d: string) => new Date(d),
                (d: string) => {
                  const [m, d2, y] = d.split("/");
                  if (
                    y &&
                    m &&
                    d2 &&
                    m.length <= 2 &&
                    d2.length <= 2 &&
                    y.length === 4
                  ) {
                    let dt = new Date(`${y}-${m}-${d2}`);
                    if (!isNaN(dt.getTime())) return dt;
                    dt = new Date(`${y}-${d2}-${m}`);
                    if (!isNaN(dt.getTime())) return dt;
                  }
                  return new Date("invalid");
                },
                (d: string) => {
                  const [d2, m, y] = d.split("-");
                  if (
                    y &&
                    m &&
                    d2 &&
                    m.length <= 2 &&
                    d2.length <= 2 &&
                    y.length === 4
                  ) {
                    let dt = new Date(`${y}-${m}-${d2}`);
                    if (!isNaN(dt.getTime())) return dt;
                    dt = new Date(`${y}-${d2}-${m}`);
                    if (!isNaN(dt.getTime())) return dt;
                  }
                  return new Date("invalid");
                },
              ];
              for (const fmt of tryFormats) {
                try {
                  const dt = fmt(dateRaw as string);
                  if (dt && !isNaN(dt.getTime())) {
                    parsedDate = dt;
                    break;
                  }
                } catch (err) {
                  console.error("Date parse error:", err);
                }
              }
            }
          }
          return {
            id: (row.id as string) || `local-${Date.now()}-${i}`,
            date: parsedDate.toISOString(),
            ticker:
              (row.ticker as string) ||
              (row.Ticker as string) ||
              (row.symbol as string) ||
              (row.Symbol as string) ||
              (row.Instrument as string) ||
              "",
            direction:
              (row.direction as string) ||
              (row.Direction as string) ||
              (pnl > 0 ? "BUY" : pnl < 0 ? "SELL" : "UNKNOWN"),
            entry,
            exit,
            size,
            pnl,
            notes:
              (row.notes as string) ||
              (row.Notes as string) ||
              (row.Comment as string) ||
              "",
            tags: row.tags
              ? String(row.tags)
                  .split(",")
                  .map((t) => t.trim())
              : [],
            strategy:
              (row.strategy as string) || (row.Strategy as string) || "",
            market_condition:
              (row.market_condition as string) ||
              (row.Market_Condition as string) ||
              "",
            instrument_type:
              (row.instrument_type as string) ||
              (row.Instrument_Type as string) ||
              "FOREX",
            win_loss: pnl > 0 ? "WIN" : pnl < 0 ? "LOSS" : "BREAKEVEN",
            screenshot_url:
              (row.screenshot_url as string) ||
              (row.Screenshot_URL as string) ||
              "",
            created_at: (row.created_at as string) || new Date().toISOString(),
          };
        });
        const sortedTrades = normalized.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setTrades(sortedTrades);
        calculateStats(sortedTrades);
        toast({
          title: "Success",
          description: `Parsed and loaded ${sortedTrades.length} historical trades from file`,
        });
      } else {
        setTrades([]);
        calculateStats([]);
        toast({
          title: "Error",
          description:
            "No valid trades found in file. Please check your file format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTrades([]);
      calculateStats([]);
      toast({
        title: "Error",
        description: "Failed to parse file. Please check your file format.",
        variant: "destructive",
      });
    }
  };

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.ticker?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStrategy =
      filterStrategy === "all" || trade.strategy === filterStrategy;
    const matchesWinLoss =
      filterWinLoss === "all" || trade.win_loss === filterWinLoss;

    return matchesSearch && matchesStrategy && matchesWinLoss;
  });

  const strategies = [
    ...new Set(trades.map((t) => t.strategy).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Trading Analytics
            </h1>
            <p className="text-muted-foreground">
              Track and analyze your trading performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Dialog open={showAddTrade} onOpenChange={setShowAddTrade}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Trade</DialogTitle>
                  <DialogDescription>
                    Enter the details of your trade
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTrade.date}
                        onChange={(e) =>
                          setNewTrade({ ...newTrade, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticker">Ticker</Label>
                      <Input
                        id="ticker"
                        value={newTrade.ticker}
                        onChange={(e) =>
                          setNewTrade({ ...newTrade, ticker: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="direction">Direction</Label>
                      <Select
                        value={newTrade.direction}
                        onValueChange={(value) =>
                          setNewTrade({ ...newTrade, direction: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BUY">Buy</SelectItem>
                          <SelectItem value="SELL">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        type="number"
                        step="0.01"
                        value={newTrade.size}
                        onChange={(e) =>
                          setNewTrade({
                            ...newTrade,
                            size: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="entry">Entry Price</Label>
                      <Input
                        id="entry"
                        type="number"
                        step="0.0001"
                        value={newTrade.entry}
                        onChange={(e) =>
                          setNewTrade({
                            ...newTrade,
                            entry: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="exit">Exit Price</Label>
                      <Input
                        id="exit"
                        type="number"
                        step="0.0001"
                        value={newTrade.exit}
                        onChange={(e) =>
                          setNewTrade({
                            ...newTrade,
                            exit: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pnl">P&L</Label>
                    <Input
                      id="pnl"
                      type="number"
                      step="0.01"
                      value={newTrade.pnl}
                      onChange={(e) =>
                        setNewTrade({
                          ...newTrade,
                          pnl: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newTrade.notes}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddTrade(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addTrade}>Add Trade</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file);
                }}
              />
              <Button variant="outline" className="pointer-events-none">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Trades
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.winRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${stats.netProfit.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg R:R</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRR.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trades">Trade Log</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Log</CardTitle>
                <CardDescription>View and manage your trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search trades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filterStrategy}
                    onValueChange={setFilterStrategy}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Strategies</SelectItem>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {strategy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterWinLoss}
                    onValueChange={setFilterWinLoss}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Win/Loss" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="WIN">Wins</SelectItem>
                      <SelectItem value="LOSS">Losses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Entry</TableHead>
                        <TableHead>Exit</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>
                            {new Date(trade.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {trade.ticker}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trade.direction === "BUY"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {trade.direction}
                            </Badge>
                          </TableCell>
                          <TableCell>{trade.entry?.toFixed(4)}</TableCell>
                          <TableCell>{trade.exit?.toFixed(4)}</TableCell>
                          <TableCell>{trade.size}</TableCell>
                          <TableCell
                            className={
                              trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            ${trade.pnl?.toFixed(2)}
                          </TableCell>
                          <TableCell>{trade.strategy}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trade.win_loss === "WIN"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {trade.win_loss}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Winning Trades</span>
                      <span className="font-medium">{stats.winningTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Losing Trades</span>
                      <span className="font-medium">{stats.losingTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Profit</span>
                      <span className="font-medium text-green-600">
                        ${stats.totalProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Loss</span>
                      <span className="font-medium text-red-600">
                        ${stats.totalLoss.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PieChart className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Monthly Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <PerformanceChart trades={trades} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingDashboard;
