import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalysisTimelineSkeleton() {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 overflow-hidden py-1">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="w-[200px] flex-shrink-0">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
