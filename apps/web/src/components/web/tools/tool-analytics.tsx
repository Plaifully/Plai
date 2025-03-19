"use client";

import { useEffect } from "react";
import { useServerAction } from "zsa-react";
import { getToolAnalytics } from "~/actions/analytics";
import { Card } from "~/components/web/ui/card";
import { EyeIcon, MousePointerClickIcon, BarChart3Icon } from "lucide-react";
import { cx } from "~/utils/cva";

interface ToolAnalyticsProps {
  slug: string;
  className?: string;
}

export function ToolAnalytics({ slug, className }: ToolAnalyticsProps) {
  const { data, isPending, execute } = useServerAction(getToolAnalytics);
  
  // Fetch analytics when component mounts
  useEffect(() => {
    execute({ slug });
  }, [slug, execute]);
  
  // Default values if data is not available
  const impressions = data?.impressions ?? 0;
  const views = data?.views ?? 0;
  const clicks = data?.clicks ?? 0;
  
  // Calculate conversion rates
  const viewToImpressionRate = impressions > 0 ? Math.round((views / impressions) * 100) : 0;
  const clickToViewRate = views > 0 ? Math.round((clicks / views) * 100) : 0;
  
  if (isPending) {
    return (
      <Card className={cx("p-4 animate-pulse", className)}>
        <div className="flex justify-between">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={cx("p-4", className)}>
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3Icon className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium">{impressions.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Impressions</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium">{views.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Views ({viewToImpressionRate}%)</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MousePointerClickIcon className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium">{clicks.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Clicks ({clickToViewRate}%)</div>
          </div>
        </div>
      </div>
    </Card>
  );
} 