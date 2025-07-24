import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CompanyCardSkeleton = ({ className }) => (
  <Card className={cn("h-full animate-pulse", className)}>
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const CompanyGridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <CompanyCardSkeleton key={i} />
    ))}
  </div>
);

export { CompanyCardSkeleton, CompanyGridSkeleton };
