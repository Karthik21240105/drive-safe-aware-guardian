
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Camera, CameraOff, Check, Settings, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  // State management
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true);
  const [alertStatus, setAlertStatus] = useState<"alert" | "warning" | "danger">("alert");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alertnessScore, setAlertnessScore] = useState(100);
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    alerts: 0,
    warnings: 0
  });
  
  // Simulation interval
  useEffect(() => {
    let interval: number | null = null;
    
    if (isMonitoring && simulationMode) {
      interval = window.setInterval(() => {
        // Simulate changing alertness levels
        const randomFactor = Math.random();
        let newScore, newStatus;
        
        if (randomFactor > 0.8) {
          // Simulate drowsiness
          newScore = Math.max(10, alertnessScore - Math.floor(Math.random() * 30));
          if (newScore < 30) {
            newStatus = "danger";
            setSessionStats(prev => ({ ...prev, warnings: prev.warnings + 1 }));
            playAlertSound("danger");
          } else if (newScore < 70) {
            newStatus = "warning";
            setSessionStats(prev => ({ ...prev, alerts: prev.alerts + 1 }));
            playAlertSound("warning");
          } else {
            newStatus = "alert";
          }
        } else {
          // Recovery or maintenance
          newScore = Math.min(100, alertnessScore + Math.floor(Math.random() * 10));
          newStatus = newScore > 70 ? "alert" : newScore > 30 ? "warning" : "danger";
        }
        
        setAlertnessScore(newScore);
        setAlertStatus(newStatus);
        setSessionStats(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, simulationMode, alertnessScore]);
  
  // Play alert sounds based on status
  const playAlertSound = (status: "warning" | "danger") => {
    const audio = new Audio();
    if (status === "warning") {
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLX/N7taiQBQVQqDj87V1IQwaRZjc+8t9MRMQPXOr09ekaT0nO2mYw+fVpHk9Hxw+WXOHqcbm3skAAMA";
    } else {
      audio.src = "data:audio/wav;base64,UklGRpYGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYYGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLX/N7taiQBQVQqDj87V1IQwaRZjc+8t9MRMQPXOr09ekaT0nO2mYw+fVpHk9Hxw+WXOHqcbm3skA+7/NCMAAAAAAAAAAAODa2M/HwrfCydLq/RYYGRYJAQIAA";
    }
    audio.volume = 0.5;
    audio.play().catch(err => console.error("Error playing sound:", err));
  };

  const toggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);
    
    if (newState) {
      toast({
        title: "Monitoring Started",
        description: simulationMode ? "Running in simulation mode" : "Live detection activated",
      });
      
      if (!simulationMode) {
        toast({
          title: "Backend Connection",
          description: "Attempting to connect to Python ML backend...",
          variant: "default"
        });
        
        // In a real app, this would connect to the Python backend
        setTimeout(() => {
          toast({
            title: "Backend Connection",
            description: "This is a frontend demo. In a real implementation, we would connect to a Python/ML backend.",
            variant: "default"
          });
        }, 3000);
      }
    } else {
      setSessionStats({ duration: 0, alerts: 0, warnings: 0 });
      setAlertnessScore(100);
      setAlertStatus("alert");
      toast({
        title: "Monitoring Stopped",
        description: "Driver monitoring system deactivated"
      });
    }
  };
  
  // Alert status indicator component
  const AlertStatusIndicator = () => {
    return (
      <div className={`p-4 rounded-lg ${
        alertStatus === "alert" ? "bg-green-100 dark:bg-green-900/30" : 
        alertStatus === "warning" ? "bg-amber-100 dark:bg-amber-900/30" : 
        "bg-red-100 dark:bg-red-900/30"
      }`}>
        <div className="flex items-center space-x-3">
          {alertStatus === "alert" && <Check className="h-6 w-6 text-green-600" />}
          {alertStatus === "warning" && <AlertTriangle className="h-6 w-6 text-amber-600 animate-pulse" />}
          {alertStatus === "danger" && <AlertCircle className="h-6 w-6 text-red-600 animate-pulse" />}
          
          <div>
            <h3 className={`font-bold ${
              alertStatus === "alert" ? "text-green-700 dark:text-green-400" : 
              alertStatus === "warning" ? "text-amber-700 dark:text-amber-400" : 
              "text-red-700 dark:text-red-400"
            }`}>
              {alertStatus === "alert" && "Driver Alert"}
              {alertStatus === "warning" && "Warning: Drowsiness Detected"}
              {alertStatus === "danger" && "DANGER: Wake Up Now!"}
            </h3>
            <p className={`text-sm ${
              alertStatus === "alert" ? "text-green-600 dark:text-green-300" : 
              alertStatus === "warning" ? "text-amber-600 dark:text-amber-300" : 
              "text-red-600 dark:text-red-300"
            }`}>
              {alertStatus === "alert" && "Driver is attentive and alert"}
              {alertStatus === "warning" && "Signs of fatigue detected - take a break soon"}
              {alertStatus === "danger" && "Immediate action required - pull over safely"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold">DriveSafe™ Drowsiness Detection</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Driver Monitoring System</h2>
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
              <Label htmlFor="simulation-mode">Simulation Mode</Label>
            </div>
            
            <Button 
              onClick={toggleMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
          </div>
        </div>
        
        {/* Alert Status */}
        <AlertStatusIndicator />
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
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
              <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                {isMonitoring ? (
                  <div className="relative w-full h-full">
                    {/* In a real implementation, this would be a video feed from the camera */}
                    {simulationMode ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-40 h-40 border-4 border-white/30 rounded-full">
                          {/* Simulated face */}
                          <div className="absolute w-full h-full rounded-full bg-gray-700/40"></div>
                          
                          {/* Eyes */}
                          <div className="absolute top-1/3 left-1/4 w-6 h-3 bg-white rounded-full 
                            transform -translate-x-1/2 -translate-y-1/2
                            overflow-hidden">
                            <div className={`w-6 h-3 bg-gray-800 rounded-full absolute top-0 
                              ${alertStatus === "alert" ? "translate-y-full" : 
                                alertStatus === "warning" ? "translate-y-1/2" : 
                                "translate-y-0"}`}>
                            </div>
                          </div>
                          <div className="absolute top-1/3 right-1/4 w-6 h-3 bg-white rounded-full 
                            transform translate-x-1/2 -translate-y-1/2
                            overflow-hidden">
                            <div className={`w-6 h-3 bg-gray-800 rounded-full absolute top-0 
                              ${alertStatus === "alert" ? "translate-y-full" : 
                                alertStatus === "warning" ? "translate-y-1/2" : 
                                "translate-y-0"}`}>
                            </div>
                          </div>
                          
                          {/* Mouth */}
                          <div className="absolute bottom-1/3 left-1/2 w-10 h-2 
                            bg-white/70 rounded-full
                            transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>
                        
                        {/* Status overlay */}
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 text-xs rounded">
                          SIMULATION MODE
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Camera className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-400">Attempting to access camera...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <CameraOff className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-400">Camera is disabled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Alertness</CardTitle>
              <CardDescription>Real-time monitoring data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alertness Score */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Alertness Score</span>
                  <span className={`text-sm font-medium ${
                    alertnessScore > 70 ? "text-green-600 dark:text-green-400" :
                    alertnessScore > 30 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  }`}>
                    {alertnessScore}%
                  </span>
                </div>
                <Progress value={alertnessScore} 
                  className={
                    alertnessScore > 70 ? "bg-green-100" :
                    alertnessScore > 30 ? "bg-amber-100" :
                    "bg-red-100"
                  }
                />
              </div>
              
              <Separator />
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Session</p>
                  <p className="text-2xl font-bold">{sessionStats.duration}s</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-amber-600">{sessionStats.warnings}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{sessionStats.alerts}</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">How it works:</p>
                <p>In a full implementation, this system would use:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Python backend with OpenCV</li>
                  <li>ML model to detect eye closure</li>
                  <li>Real-time alertness scoring</li>
                  <li>Audio-visual warning system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tech Stack Information */}
        <Card>
          <CardHeader>
            <CardTitle>Drowsiness Detection System: Technical Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="frontend">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend (Python/ML)</TabsTrigger>
              </TabsList>
              <TabsContent value="frontend" className="mt-4 space-y-4">
                <p>The frontend interface is built with:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>HTML5</strong> - For structure and semantic markup</li>
                  <li><strong>TailwindCSS</strong> - For responsive and modern UI design</li>
                  <li><strong>JavaScript</strong> - For interactive elements and real-time updates</li>
                  <li><strong>React</strong> - For component-based architecture and state management</li>
                </ul>
                <p>The interface provides real-time visual feedback, status indicators, and session statistics.</p>
              </TabsContent>
              <TabsContent value="backend" className="mt-4 space-y-4">
                <p>In a complete implementation, the backend would use:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Python</strong> - Core programming language</li>
                  <li><strong>OpenCV</strong> - For video capture and face/eye detection</li>
                  <li><strong>dlib</strong> - For facial landmark detection</li>
                  <li><strong>TensorFlow/PyTorch</strong> - For ML model implementation</li>
                  <li><strong>Flask/FastAPI</strong> - For backend API to interface with the frontend</li>
                </ul>
                <p>The ML pipeline would involve:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Face detection in video frames</li>
                  <li>Eye region extraction</li>
                  <li>Eye aspect ratio (EAR) calculation to detect blinks</li>
                  <li>ML model for drowsiness classification based on blink patterns</li>
                  <li>Real-time alertness scoring and warning system</li>
                </ol>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Settings</DialogTitle>
            <DialogDescription>
              Configure the drowsiness detection parameters
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sensitivity">Detection Sensitivity</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Low</span>
                <input
                  id="sensitivity"
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">High</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alert-volume">Alert Volume</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Off</span>
                <input
                  id="alert-volume"
                  type="range"
                  min="0"
                  max="10"
                  defaultValue="5"
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">Max</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="data-logging" />
              <Label htmlFor="data-logging">Enable Data Logging</Label>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            In a complete implementation, these settings would configure the Python/ML backend parameters.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
