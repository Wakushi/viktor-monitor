"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function login() {
    setIsLoading(true)

    try {
      const response = await fetch("api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAuthError("")
        router.push("/admin")
      } else {
        setAuthError("Invalid password")
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-md">
      <Card className="border shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Admin Access</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setAuthError("")
                }}
                placeholder="Enter admin password"
                className="w-full"
              />
            </div>
            {authError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Error</AlertTitle>
                <AlertDescription className="text-xs">
                  {authError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={login} className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
