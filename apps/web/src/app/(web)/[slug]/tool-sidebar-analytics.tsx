import { EyeIcon, MousePointerClickIcon, BarChart3Icon } from "lucide-react";
import { Card } from "~/components/web/ui/card";
import { H5 } from "~/components/common/heading";
import { cx } from "~/utils/cva";

interface ToolSidebarAnalyticsProps {
  tool: {
    impressions: number;
    views: number;
    clicks: number;
  };
  className?: string;
}

export function ToolSidebarAnalytics({ tool, className }: ToolSidebarAnalyticsProps) {
  // Default values if data is not available
  const impressions = tool.impressions ?? 0;
  const views = tool.views ?? 0;
  const clicks = tool.clicks ?? 0;
  
  // Calculate conversion rates
  const viewToImpressionRate = impressions > 0 ? Math.round((views / impressions) * 100) : 0;
  const clickToViewRate = views > 0 ? Math.round((clicks / views) * 100) : 0;
  
  return (
    <Card hover={false} focus={false} className={cx("p-4", className)}>
      <H5 as="strong" className="mb-1">Analytics:</H5>
      
      <div className="grid grid-cols-3 gap-2">
        {/* Impressions */}
        <div className="flex flex-col items-center justify-center p-2">
          <BarChart3Icon className="h-4 w-4 text-gray-500 mb-1" />
          <div className="text-sm font-medium">{impressions.toLocaleString()}</div>
          <div className="text-xs text-gray-500 text-center">Impressions</div>
        </div>
        
        {/* Views */}
        <div className="flex flex-col items-center justify-center p-2">
          <EyeIcon className="h-4 w-4 text-gray-500 mb-1" />
          <div className="text-sm font-medium">{views.toLocaleString()}</div>
          <div className="text-xs text-gray-500 text-center">Views <span className="whitespace-nowrap">({viewToImpressionRate}%)</span></div>
        </div>
        
        {/* Clicks */}
        <div className="flex flex-col items-center justify-center p-2">
          <MousePointerClickIcon className="h-4 w-4 text-gray-500 mb-1" />
          <div className="text-sm font-medium">{clicks.toLocaleString()}</div>
          <div className="text-xs text-gray-500 text-center">Clicks <span className="whitespace-nowrap">({clickToViewRate}%)</span></div>
        </div>
      </div>
    </Card>
  );
} 