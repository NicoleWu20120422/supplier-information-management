import { Card, CardContent } from "@/components/ui/card";
import { Building, DollarSign, Shield, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/use-suppliers";
import { formatCurrency, formatPercentage } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function MetricsCards() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const metrics = [
    {
      title: "Total Suppliers",
      value: analytics.totalSuppliers.toLocaleString(),
      icon: Building,
      change: "+8.2%",
      changeType: "positive" as const,
      color: "primary",
    },
    {
      title: "Annual Spend",
      value: formatCurrency(analytics.totalSpend),
      icon: DollarSign,
      change: "+12.4%",
      changeType: "positive" as const,
      color: "accent",
    },
    {
      title: "Risk Score",
      value: analytics.avgRiskScore.toString(),
      icon: Shield,
      change: "+2.1",
      changeType: "negative" as const,
      color: "destructive",
    },
    {
      title: "Performance",
      value: formatPercentage(analytics.avgPerformance),
      icon: TrendingUp,
      change: "+1.8%",
      changeType: "positive" as const,
      color: "chart-3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-cards">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="border border-border shadow-sm" data-testid={`metric-card-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground" data-testid={`metric-title-${index}`}>
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid={`metric-value-${index}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 bg-${metric.color}/10 rounded-lg`}>
                  <IconComponent className={`text-${metric.color} w-6 h-6`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`font-medium ${
                    metric.changeType === "positive" ? "text-chart-3" : "text-destructive"
                  }`}
                  data-testid={`metric-change-${index}`}
                >
                  {metric.changeType === "positive" ? "↗ " : "↗ "}
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-2">vs last period</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
