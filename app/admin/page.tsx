"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Settings, PlayCircle, Loader2 } from "lucide-react"
import { useWeekAnalysis } from "@/stores/week-analysis.store"
import WeeklyAnalysisCard from "@/components/week-analysis-card"
import LogViewer from "@/components/log-viewer"
import { MobulaChain } from "@/types/week-analysis.type"

export default function AdminPage() {
  const [isTestMode, setIsTestMode] = useState(false)
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const {
    isLoading: isLoadingAnalysis,
    weekAnalysesRecords,
    fetchAnalyses,
  } = useWeekAnalysis()

  useEffect(() => {
    async function getWhiteListedChains() {
      setIsLoading(true)
      try {
        const response = await fetch("/api/settings")
        const { data, success } = await response.json()

        if (success) {
          setSelectedChains(data)
          return
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    getWhiteListedChains()
  }, [])

  function handleChainToggle(chainId: string) {
    setSelectedChains((prev) => {
      if (prev.includes(chainId)) {
        return prev.filter((id) => id !== chainId)
      } else {
        return [...prev, chainId]
      }
    })
  }

  async function handleTriggerAnalysis() {
    try {
      await fetch("/api/analysis/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: isTestMode ? "test" : "live",
        }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleUpdateWhitelistedChains() {
    setIsLoading(true)

    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chains: selectedChains,
        }),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container flex flex-col gap-4 mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1 border shadow-md w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Admin Panel</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* Analysis Trigger Section */}
            <div className="flex-1 flex flex-col self-stretch rounded-md border p-4">
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle className="h-4 w-4 text-primary" />
                <h3 className="text-base font-medium">Trigger Analysis</h3>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  id="test-mode"
                  checked={isTestMode}
                  onCheckedChange={setIsTestMode}
                />
                <Label htmlFor="test-mode">Test Mode</Label>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <Button
                  onClick={handleTriggerAnalysis}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Processing..." : "Trigger Analysis"}
                </Button>
                <Button
                  onClick={fetchAnalyses}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Processing..." : "Refresh Analysis"}
                </Button>
              </div>
            </div>

            {/* Chain Selection Section */}
            <div className="flex-1 self-stretch rounded-md border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-primary" />
                <h3 className="text-base font-medium">Select Chains</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 max-h-[200px] overflow-y-auto">
                {Object.values(MobulaChain).map((chain) => (
                  <div key={chain} className="flex items-center space-x-2">
                    <Checkbox
                      id={chain}
                      checked={selectedChains.includes(chain)}
                      onCheckedChange={() => handleChainToggle(chain)}
                    />
                    <Label htmlFor={chain}>{chain}</Label>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUpdateWhitelistedChains}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? "Saving..." : "Save Chain Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex-1 w-full">
          <LogViewer />
        </div>
      </div>

      {isLoadingAnalysis ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : weekAnalysesRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekAnalysesRecords
            .filter((analyse) => analyse.test)
            .map((record) => (
              <WeeklyAnalysisCard key={record.id} record={record} />
            ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">No analyses found</p>
        </div>
      )}
    </div>
  )
}
