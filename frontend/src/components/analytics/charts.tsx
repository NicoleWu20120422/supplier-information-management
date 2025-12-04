import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, TrendingUp } from "lucide-react";
import { useSuppliers, useAnalytics } from "@/hooks/use-suppliers";
import { SUPPLIER_SEGMENTS } from "@/lib/constants";

export default function Charts() {
  const { data: suppliers } = useSuppliers();
  const { data: analytics } = useAnalytics();

  const segmentData = analytics?.segmentCounts || {};
  const total = Object.values(segmentData).reduce((sum, count) => sum + count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8" data-testid="analytics-charts">
      {/* Supplier Distribution Chart */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Supplier Distribution</CardTitle>
            <Select defaultValue="last-12-months">
              <SelectTrigger className="w-48" data-testid="time-period-select">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-12-months">Last 12 months</SelectItem>
                <SelectItem value="last-6-months">Last 6 months</SelectItem>
                <SelectItem value="last-quarter">Last quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container" data-testid="distribution-chart">
            <div className="text-center text-muted-foreground">
              <PieChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-sm mb-4">Supplier Distribution by Segment</p>
              
              {/* Simple distribution display */}
              <div className="space-y-3">
                {Object.entries(SUPPLIER_SEGMENTS).map(([key, segment]) => {
                  const count = segmentData[key] || 0;
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${segment.color}`} />
                        <span className="text-sm font-medium">{segment.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Trend Analysis Chart */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Risk Trend Analysis</CardTitle>
            <Select defaultValue="all-categories">
              <SelectTrigger className="w-48" data-testid="category-filter-select">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {Object.entries(SUPPLIER_SEGMENTS).map(([key, segment]) => (
                  <SelectItem key={key} value={key}>
                    {segment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container" data-testid="risk-trend-chart">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-sm mb-4">Risk Score Trends Over Time</p>
              
              {/* Simple trend indicators */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <span className="text-sm">Average Risk Score</span>
                  <span className="text-lg font-semibold text-destructive">
                    {analytics?.avgRiskScore || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <span className="text-sm">High Risk Suppliers</span>
                  <span className="text-lg font-semibold text-destructive">
                    {suppliers?.filter(s => parseFloat(s.riskScore) >= 7).length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <span className="text-sm">Low Risk Suppliers</span>
                  <span className="text-lg font-semibold text-chart-3">
                    {suppliers?.filter(s => parseFloat(s.riskScore) < 4).length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
