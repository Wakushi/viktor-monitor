import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TokenSummarySkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <Skeleton className="h-8 w-64" />
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-[300px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-28" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
