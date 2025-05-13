
import { useEffect, useState } from "react";
import { AlertTriangle, Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertStatus = "alert" | "warning" | "danger";

interface StatusIndicatorProps {
  status: AlertStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const [audioAlert, setAudioAlert] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element for alerts
    const audio = new Audio();
    
    if (status === "warning") {
      audio.src = "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2ooRGwGjEA2RgvFtHWg=="
      audio.volume = 0.3;
      audio.loop = true;
    } else if (status === "danger") {
      audio.src = "data:audio/wav;base64,UklGRigBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQBAADpAFgCKAIoAZUBu/w6/bH7a/zX/Z/9sv6u/3cBdwF4AyMDVQJVAm8AbwBJ/hv+DP1f/ewAAAGaBGUEtwmaCQINZA3HDDAMWgZRBu3/nv/jA0MEOg1nDTcUSBR9GFoYsBCsEGcI/wejAYQBGALQAREIvgcfEAIQ4xToFBcUCBSyDG0M3QBvALD4UPh093z39fve+wYGZwZHE4cT0RnlGYQVeRX0DOsMVQILAun83fx2/Gb88wFqAc8Nag3SFJcUchWmFZMOpQ4mBssGDP5U/j/5s/kb+lr6NOA04MTP0M/W3M3cyO667t/34PdeCIcI8BQsFSgdVh3DHYUd4RPrE3kGeAaP+7P7jvhg+E/4Vvj8AgoD6BH1EScbQxstJFIkmiKLIhwZExnrCmcKAvr1+dPsqOy0373fm9O2065bsluyarR2tNq43rgfxkfG4dvx2xTzIvMi"
      audio.volume = 0.5;
      audio.loop = true;
    }
    
    setAudioAlert(audio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioAlert) {
      if (status === "warning" || status === "danger") {
        audioAlert.play().catch(e => console.error("Error playing audio alert:", e));
      } else {
        audioAlert.pause();
        audioAlert.currentTime = 0;
      }
    }
    
    return () => {
      if (audioAlert) {
        audioAlert.pause();
        audioAlert.currentTime = 0;
      }
    };
  }, [status, audioAlert]);

  return (
    <div className={cn(
      "flex items-center justify-center rounded-lg p-4 text-white",
      status === "alert" && "bg-green-500",
      status === "warning" && "bg-amber-500 animate-pulse",
      status === "danger" && "bg-red-500 animate-pulse"
    )}>
      <div className="flex items-center space-x-3">
        {status === "alert" && <Check className="h-6 w-6" />}
        {status === "warning" && <AlertTriangle className="h-6 w-6" />}
        {status === "danger" && <XCircle className="h-6 w-6" />}
        
        <div>
          <h3 className="text-lg font-bold">
            {status === "alert" && "Driver Alert"}
            {status === "warning" && "Warning: Drowsiness Detected"}
            {status === "danger" && "DANGER: Wake Up Now!"}
          </h3>
          <p className="text-sm">
            {status === "alert" && "Driver is attentive and alert"}
            {status === "warning" && "Signs of fatigue detected - take a break soon"}
            {status === "danger" && "Immediate action required - pull over safely"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
