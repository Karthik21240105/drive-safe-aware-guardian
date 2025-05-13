
/**
 * This file simulates ML functionality that would typically be provided by a Python backend
 * In a real implementation, this would connect to Python ML models via API calls
 */

import { AlertStatus } from "@/components/StatusIndicator";

// Simulated eye aspect ratio (EAR) calculation
// In a real implementation, this would be calculated from facial landmarks
export const calculateEAR = (frame: number, cycleLength: number): number => {
  // Simulate an eye aspect ratio that varies over time
  // Normal EAR is around 0.25-0.3, drowsy is below 0.2
  const normalEAR = 0.28;
  const drowsyEAR = 0.15;
  
  // Calculate position in the cycle (0 to 1)
  const position = (frame % cycleLength) / cycleLength;
  
  if (position < 0.6) {
    // Alert state - normal EAR
    return normalEAR;
  } else if (position < 0.8) {
    // Warning state - decreasing EAR
    const progress = (position - 0.6) / 0.2;
    return normalEAR - progress * (normalEAR - drowsyEAR);
  } else {
    // Danger state - low EAR
    return drowsyEAR;
  }
};

// Determine drowsiness status based on EAR and other factors
export const determineDrowsinessStatus = (
  ear: number, 
  blinkFrequency: number, 
  headPose: { yaw: number, pitch: number, roll: number }
): AlertStatus => {
  // Thresholds (would be calibrated per user in a real system)
  const earThresholdWarning = 0.21;
  const earThresholdDanger = 0.18;
  
  // Primary check is EAR
  if (ear < earThresholdDanger) {
    return "danger";
  } else if (ear < earThresholdWarning) {
    return "warning";
  }
  
  // Secondary check - head pose (nodding)
  if (Math.abs(headPose.pitch) > 15) {
    return "warning";
  }
  
  // Eyes open, driver seems alert
  return "alert";
};

// Simulated Python ML model prediction interface
export const predictDrowsiness = (frameNumber: number): {
  status: AlertStatus;
  confidence: number;
  ear: number;
  blinkRate: number;
  headPose: { yaw: number, pitch: number, roll: number };
} => {
  const cycleLength = 18;
  const ear = calculateEAR(frameNumber, cycleLength);
  const position = (frameNumber % cycleLength) / cycleLength;
  
  // Simulate head pose data
  const headPose = {
    yaw: Math.sin(frameNumber / 5) * 10,
    pitch: position > 0.8 ? Math.sin(frameNumber / 2) * 20 : Math.sin(frameNumber / 2) * 5,
    roll: Math.sin(frameNumber / 7) * 5
  };
  
  // Simulate blink rate (blinks per minute)
  const normalBlinkRate = 15;
  const drowsyBlinkRate = 5;
  const blinkRate = position < 0.6 
    ? normalBlinkRate 
    : position < 0.8 
      ? normalBlinkRate - (position - 0.6) / 0.2 * (normalBlinkRate - drowsyBlinkRate)
      : drowsyBlinkRate;
  
  // Determine status
  const status = determineDrowsinessStatus(ear, blinkRate, headPose);
  
  // Calculate confidence based on how far from thresholds
  let confidence: number;
  if (status === "alert") {
    confidence = 0.85 + Math.random() * 0.15;
  } else if (status === "warning") {
    confidence = 0.75 + Math.random() * 0.15;
  } else {
    confidence = 0.9 + Math.random() * 0.1;
  }
  
  return {
    status,
    confidence,
    ear,
    blinkRate,
    headPose
  };
};
