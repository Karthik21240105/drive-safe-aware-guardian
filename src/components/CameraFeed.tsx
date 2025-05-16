
import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertStatus } from "./StatusIndicator";
import { cn } from "@/lib/utils";

interface CameraFeedProps {
  isActive: boolean;
  simulationMode: boolean;
  onStatusChange: (status: AlertStatus) => void;
}

const CameraFeed = ({ isActive, simulationMode, onStatusChange }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Simulation variables
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const [simulationFrame, setSimulationFrame] = useState(0);
  
  // Clean up function for camera stream
  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  };
  
  // Start or stop camera based on isActive prop
  useEffect(() => {
    if (isActive) {
      if (simulationMode) {
        startSimulation();
      } else {
        startCamera();
      }
    } else {
      stopMediaTracks();
    }
    
    return () => {
      stopMediaTracks();
    };
  }, [isActive, simulationMode]);
  
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Start processing frames for eye detection
      if (!simulationMode) {
        startEyeDetection();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };
  
  const startEyeDetection = () => {
    // In a real application, this would use computer vision to detect eye state
    // For now we'll simulate random eye states
    const detectionInterval = setInterval(() => {
      if (!isActive || simulationMode) {
        clearInterval(detectionInterval);
        return;
      }
      
      const randomValue = Math.random();
      if (randomValue > 0.85) {
        // 15% chance of warning
        onStatusChange("warning");
        drawLiveDetection("warning");
      } else if (randomValue > 0.95) {
        // 5% chance of danger
        onStatusChange("danger");
        drawLiveDetection("danger");
      } else {
        // 80% chance of alert
        onStatusChange("alert");
        drawLiveDetection("alert");
      }
    }, 2000);
    
    return () => clearInterval(detectionInterval);
  };
  
  const drawLiveDetection = (state: AlertStatus) => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw detection overlay
    ctx.strokeStyle = state === "alert" ? "#22c55e" : state === "warning" ? "#f59e0b" : "#ef4444";
    ctx.lineWidth = 3;
    
    // Detect face area (simplified - would use ML in real app)
    const faceX = canvas.width / 2 - 100;
    const faceY = canvas.height / 2 - 150;
    const faceWidth = 200;
    const faceHeight = 250;
    
    // Draw face box
    ctx.strokeRect(faceX, faceY, faceWidth, faceHeight);
    
    // Draw eye regions
    ctx.beginPath();
    // Left eye region
    ctx.rect(faceX + 40, faceY + 70, 40, 25);
    // Right eye region
    ctx.rect(faceX + 120, faceY + 70, 40, 25);
    ctx.stroke();
    
    // Add status text
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    
    if (state === "alert") {
      ctx.fillText("Eyes Open", canvas.width / 2, faceY + faceHeight + 30);
    } else if (state === "warning") {
      ctx.fillText("Eyes Closing", canvas.width / 2, faceY + faceHeight + 30);
    } else {
      ctx.fillText("Eyes Closed", canvas.width / 2, faceY + faceHeight + 30);
    }
  };
  
  const startSimulation = () => {
    setError(null);
    
    // Create a repeating pattern for simulation
    // 10 seconds alert, 5 seconds warning, 3 seconds danger, repeat
    const simulationCycle = 18; // Total seconds in one cycle
    
    simulationRef.current = setInterval(() => {
      setSimulationFrame(prev => (prev + 1) % simulationCycle);
    }, 1000);
  };
  
  // Effects for simulation status changes
  useEffect(() => {
    if (simulationMode && isActive) {
      if (simulationFrame < 10) {
        onStatusChange("alert");
      } else if (simulationFrame < 15) {
        onStatusChange("warning");
      } else {
        onStatusChange("danger");
      }
      
      // Draw fake detection boxes on the canvas
      drawSimulationFrame();
    }
  }, [simulationFrame, simulationMode, isActive]);
  
  // Draw simulation graphics
  const drawSimulationFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (simulationFrame < 10) {
      // Alert state - draw open eyes
      drawFaceDetection(ctx, "alert");
    } else if (simulationFrame < 15) {
      // Warning state - draw half-closed eyes
      drawFaceDetection(ctx, "warning");
    } else {
      // Danger state - draw closed eyes
      drawFaceDetection(ctx, "danger");
    }
  };
  
  const drawFaceDetection = (ctx: CanvasRenderingContext2D, state: AlertStatus) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Face outline
    ctx.strokeStyle = state === "alert" ? "#22c55e" : state === "warning" ? "#f59e0b" : "#ef4444";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width / 2 - 60, canvas.height / 2 - 80, 120, 160);
    
    // Eyes detection
    ctx.beginPath();
    
    // Left eye
    if (state === "alert") {
      ctx.ellipse(canvas.width / 2 - 25, canvas.height / 2 - 30, 15, 8, 0, 0, 2 * Math.PI);
    } else if (state === "warning") {
      ctx.ellipse(canvas.width / 2 - 25, canvas.height / 2 - 30, 15, 4, 0, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(canvas.width / 2 - 40, canvas.height / 2 - 30);
      ctx.lineTo(canvas.width / 2 - 10, canvas.height / 2 - 30);
    }
    
    // Right eye
    if (state === "alert") {
      ctx.ellipse(canvas.width / 2 + 25, canvas.height / 2 - 30, 15, 8, 0, 0, 2 * Math.PI);
    } else if (state === "warning") {
      ctx.ellipse(canvas.width / 2 + 25, canvas.height / 2 - 30, 15, 4, 0, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(canvas.width / 2 + 10, canvas.height / 2 - 30);
      ctx.lineTo(canvas.width / 2 + 40, canvas.height / 2 - 30);
    }
    
    ctx.stroke();
    
    // Add some text
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    
    if (state === "alert") {
      ctx.fillText("Eyes Open: 100%", canvas.width / 2, canvas.height / 2 + 60);
    } else if (state === "warning") {
      ctx.fillText("Eyes Closing: 60%", canvas.width / 2, canvas.height / 2 + 60);
    } else {
      ctx.fillText("Eyes Closed: 95%", canvas.width / 2, canvas.height / 2 + 60);
    }
    
    // Add frame counter
    ctx.fillText(`Frame: ${simulationFrame}`, canvas.width / 2, canvas.height - 20);
  };

  return (
    <div className="relative rounded-lg bg-black overflow-hidden aspect-video">
      {isActive ? (
        <>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className={cn("w-full h-full object-cover", simulationMode && "opacity-40")}
          />
          <canvas 
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {/* Overlay UI elements */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {simulationMode ? "SIMULATION MODE" : "LIVE DETECTION"}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <CameraOff className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Camera is disabled</p>
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
