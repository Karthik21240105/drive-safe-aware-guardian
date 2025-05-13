
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Settings } from "lucide-react";
import StatusIndicator, { AlertStatus } from "@/components/StatusIndicator";
import CameraFeed from "@/components/CameraFeed";
import StatisticsPanel from "@/components/StatisticsPanel";
import SettingsPanel from "@/components/SettingsPanel";
import Header from "@/components/Header";

const Dashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<AlertStatus>("alert");
  const [showSettings, setShowSettings] = useState(false);

  const toggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);
    
    if (newState) {
      toast({
        title: "Monitoring Started",
        description: simulationMode ? "Running in simulation mode" : "Camera monitoring activated"
      });
    } else {
      toast({
        title: "Monitoring Stopped",
        description: "Driver monitoring system deactivated"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSettings={() => setShowSettings(!showSettings)} />
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Driver Monitoring System</h1>
              <p className="text-muted-foreground">Real-time drowsiness detection and alertness monitoring</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="simulation-mode" 
                  checked={simulationMode}
                  onCheckedChange={setSimulationMode}
                  disabled={isMonitoring}
                />
                <label htmlFor="simulation-mode" className="text-sm font-medium">
                  Simulation Mode
                </label>
              </div>
              
              <Button 
                onClick={toggleMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
              >
                {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="mb-6">
          <StatusIndicator status={currentStatus} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" /> 
                Video Feed
              </CardTitle>
              <CardDescription>
                {simulationMode 
                  ? "Simulation mode: demonstrating detection patterns" 
                  : "Live camera feed with drowsiness detection"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CameraFeed 
                isActive={isMonitoring}
                simulationMode={simulationMode}
                onStatusChange={setCurrentStatus}
              />
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-6">
            <StatisticsPanel 
              currentStatus={currentStatus}
              isActive={isMonitoring}
              simulationMode={simulationMode}
            />
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </main>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        DriveSafe™ Drowsiness Detection System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Dashboard;
