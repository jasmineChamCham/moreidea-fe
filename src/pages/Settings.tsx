import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("moreidea_gemini_key") || "";
    setApiKey(key);
  }, []);

  const handleSave = () => {
    localStorage.setItem("moreidea_gemini_key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container max-w-xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Enter your Google AI Studio API key to enable script generation. Get one free at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              aistudio.google.com
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSave} className="w-full font-display">
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save API Key
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
