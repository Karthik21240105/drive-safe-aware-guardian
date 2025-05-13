
import { useEffect, useState } from "react";
import { AlertStatus } from "./StatusIndicator";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatisticsPanelProps {
  currentStatus: AlertStatus;
  isActive: boolean;
  simulationMode: boolean;
}

interface StatusLog {
  timestamp: number;
  status: AlertStatus;
}

interface ChartDataPoint {
  time: string;
  alertness: number;
}

const StatusToValue = {
  "alert": 100,
  "warning": 50,
  "danger": 10
};

const StatisticsPanel = ({ currentStatus, isActive, simulationMode }: StatisticsPanelProps) => {
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState({
    alertPercentage: 100,
    warningPercentage: 0,
    dangerPercentage: 0,
    sessionDuration: 0
  });
  
  // Log status changes
  useEffect(() => {
    if (isActive) {
      setStatusLogs(logs => [...logs, { timestamp: Date.now(), status: currentStatus }]);
    }
  }, [currentStatus, isActive]);
  
  // Update chart data
  useEffect(() => {
    if (statusLogs.length === 0) return;
    
    const now = Date.now();
    const visibleLogs = statusLogs.filter(log => now - log.timestamp < 60000); // Last minute
    
    const newChartData: ChartDataPoint[] = [];
    
    // Group logs into 5-second intervals
    const intervalSize = 5000; // 5 seconds
    const oldestTimestamp = Math.max(now - 60000, visibleLogs[0]?.timestamp || now);
    
    for (let t = oldestTimestamp; t <= now; t += intervalSize) {
      const logsInInterval = visibleLogs.filter(log => 
        log.timestamp >= t && log.timestamp < t + intervalSize
      );
      
      if (logsInInterval.length > 0) {
        // Average the statuses in this interval
        const avgValue = logsInInterval.reduce((sum, log) => sum + StatusToValue[log.status], 0) / logsInInterval.length;
        
        newChartData.push({
          time: new Date(t).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
          alertness: avgValue
        });
      } else if (newChartData.length > 0) {
        // Fill gaps with the last known value
        newChartData.push({
          time: new Date(t).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
          alertness: newChartData[newChartData.length - 1].alertness
        });
      }
    }
    
    setChartData(newChartData);
    
    // Update statistics
    if (visibleLogs.length > 0) {
      const alertCount = visibleLogs.filter(log => log.status === "alert").length;
      const warningCount = visibleLogs.filter(log => log.status === "warning").length;
      const dangerCount = visibleLogs.filter(log => log.status === "danger").length;
      const total = visibleLogs.length;
      
      setStats({
        alertPercentage: Math.round((alertCount / total) * 100),
        warningPercentage: Math.round((warningCount / total) * 100),
        dangerPercentage: Math.round((dangerCount / total) * 100),
        sessionDuration: Math.round((now - statusLogs[0].timestamp) / 1000)
      });
    }
  }, [statusLogs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Alertness Statistics</CardTitle>
        <CardDescription>
          {isActive ? 
            "Real-time monitoring statistics" : 
            "Monitoring disabled - no data being collected"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded">
              <div className="text-sm text-muted-foreground">Alert State</div>
              <div className="text-2xl font-bold text-green-500">{stats.alertPercentage}%</div>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded">
              <div className="text-sm text-muted-foreground">Warning State</div>
              <div className="text-2xl font-bold text-amber-500">{stats.warningPercentage}%</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded">
              <div className="text-sm text-muted-foreground">Danger State</div>
              <div className="text-2xl font-bold text-red-500">{stats.dangerPercentage}%</div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-2">Alertness Trend (Last 60 seconds)</div>
            <div className="h-[180px] w-full">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 10 }}
                      tickCount={6} 
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tickCount={5}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="alertness" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded">
                  <p className="text-muted-foreground text-sm">
                    Not enough data to display chart
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground pt-2">
            Session duration: {Math.floor(stats.sessionDuration / 60)}m {stats.sessionDuration % 60}s
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
