import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function DevModeBanner() {
  return (
    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Development Mode:</strong> Authentication is not configured. The app is running in demo mode. 
        Configure Supabase credentials in your .env file to enable authentication.
      </AlertDescription>
    </Alert>
  )
}
