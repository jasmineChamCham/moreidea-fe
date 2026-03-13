import { useState } from "react"
import { useNavigate } from "react-router-dom"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"
import { getCurrentUser, onAuthStateChange } from "@/lib/auth"

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          navigate("/")
        }
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      if (user) {
        toast.success(`Welcome back, ${user.name}!`)
        navigate("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">Welcome to MoreIdea</CardTitle>
          <CardDescription>
            Sign in to start extracting and organizing ideas from your favorite content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleLoginButton
            onSuccess={() => {
              // Success will be handled by the auth state change listener
            }}
            onError={(error) => {
              toast.error(error.message || "Failed to sign in with Google")
            }}
          />
          
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
