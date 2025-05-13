
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    enableSounds: true,
    cameraResolution: "high",
    detectionSensitivity: "medium",
    saveSessionData: false
  });
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your drowsiness detection settings</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Detection Settings</h3>
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Detection Sensitivity</div>
                <div className="text-sm text-muted-foreground">
                  How sensitive the system is to eye closure
                </div>
              </div>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((option) => (
                  <Button
                    key={option}
                    variant={settings.detectionSensitivity === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, detectionSensitivity: option }))}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Camera Resolution</div>
                <div className="text-sm text-muted-foreground">
                  Higher resolution uses more resources
                </div>
              </div>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((option) => (
                  <Button
                    key={option}
                    variant={settings.cameraResolution === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, cameraResolution: option }))}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Notification Settings</h3>
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Enable Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Show visual alerts when drowsiness is detected
                </div>
              </div>
              <Switch 
                checked={settings.enableNotifications}
                onCheckedChange={() => handleToggle("enableNotifications")}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Enable Sounds</div>
                <div className="text-sm text-muted-foreground">
                  Play audio alerts when drowsiness is detected
                </div>
              </div>
              <Switch 
                checked={settings.enableSounds}
                onCheckedChange={() => handleToggle("enableSounds")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Data Settings</h3>
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Save Session Data</div>
                <div className="text-sm text-muted-foreground">
                  Store monitoring data for later analysis
                </div>
              </div>
              <Switch 
                checked={settings.saveSessionData}
                onCheckedChange={() => handleToggle("saveSessionData")}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
