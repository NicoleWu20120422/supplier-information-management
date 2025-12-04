import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Minus
} from "lucide-react";

interface PerformanceAnalyticsProps {
  supplierId: string;
  supplierName: string;
}

const getMetricIcon = (metricType: string) => {
  switch (metricType) {
    case "delivery": return <Clock className="h-4 w-4" />;
    case "quality": return <CheckCircle className="h-4 w-4" />;
    case "cost": return <Target className="h-4 w-4" />;
    case "service": return <Activity className="h-4 w-4" />;
    case "innovation": return <TrendingUp className="h-4 w-4" />;
    case "compliance": return <CheckCircle className="h-4 w-4" />;
    default: return <BarChart3 className="h-4 w-4" />;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "improving": return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "declining": return <TrendingDown className="h-4 w-4 text-destructive" />;
    default: return <Minus className="h-4 w-4 text-yellow-600" />;
  }
};

const getMetricColor = (value: number, target: number, benchmark: number) => {
  if (value >= target) return "text-green-600";
  if (value >= benchmark) return "text-yellow-600";
  return "text-destructive";
};

const getPerformanceGrade = (value: number, target: number) => {
  const percentage = (value / target) * 100;
  if (percentage >= 95) return { grade: "A+", color: "text-green-600" };
  if (percentage >= 90) return { grade: "A", color: "text-green-600" };
  if (percentage >= 80) return { grade: "B", color: "text-yellow-600" };
  if (percentage >= 70) return { grade: "C", color: "text-orange-600" };
  return { grade: "D", color: "text-destructive" };
};

export function PerformanceAnalytics({ supplierId, supplierName }: PerformanceAnalyticsProps) {
  const { data: metrics = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/suppliers", supplierId, "performance"],
    enabled: !!supplierId
  });

  const { data: slaMetrics = [] } = useQuery<any[]>({
    queryKey: ["/api/suppliers", supplierId, "sla"],
    enabled: !!supplierId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Loading performance data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Performance tracking and benchmarking for {supplierName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No performance metrics available</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              data-testid="button-add-metrics"
            >
              Add Performance Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group metrics by type
  const metricsByType = metrics.reduce((acc: any, metric: any) => {
    if (!acc[metric.metricType]) acc[metric.metricType] = [];
    acc[metric.metricType].push(metric);
    return acc;
  }, {});

  // Calculate overall performance score
  const overallScore = metrics.reduce((sum: number, metric: any) => {
    const value = parseFloat(metric.value);
    const target = parseFloat(metric.target);
    return sum + ((value / target) * 100);
  }, 0) / metrics.length;

  const overallGrade = getPerformanceGrade(overallScore, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
        <CardDescription>
          Comprehensive performance tracking and benchmarking for {supplierName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[700px]">
          <div className="space-y-6">
            {/* Overall Performance Score */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${overallGrade.color}`}>
                        {overallGrade.grade}
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{overallScore.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">vs Target</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Performance Trends</div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-600">
                        {metrics.filter((m: any) => m.trend === "improving").length} Improving
                      </Badge>
                      <Badge variant="outline" className="text-destructive">
                        {metrics.filter((m: any) => m.trend === "declining").length} Declining
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Progress value={overallScore} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics by Category */}
            <div className="grid gap-6">
              {Object.entries(metricsByType as Record<string, any[]>).map(([type, typeMetrics]) => (
                <Card key={type} className="border-l-4 border-l-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(type)}
                        <span className="capitalize">{type} Performance</span>
                      </div>
                      <Badge variant="outline">{typeMetrics.length} metrics</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {typeMetrics.map((metric: any) => {
                        const value = parseFloat(metric.value);
                        const target = parseFloat(metric.target);
                        const benchmark = parseFloat(metric.benchmark || "0");
                        const achievement = (value / target) * 100;
                        const vsbenchmark = benchmark > 0 ? ((value - benchmark) / benchmark) * 100 : 0;
                        
                        return (
                          <div key={metric.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-medium" data-testid={`text-metric-${metric.metricType}`}>
                                  {metric.metricType.charAt(0).toUpperCase() + metric.metricType.slice(1)} Score
                                </div>
                                <div className="text-sm text-muted-foreground">{metric.period}</div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {getTrendIcon(metric.trend)}
                                <span className="font-medium capitalize">{metric.trend}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Current</div>
                                <div className={`text-xl font-bold ${getMetricColor(value, target, benchmark)}`}>
                                  {value.toFixed(1)}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground">Target</div>
                                <div className="text-xl font-bold text-primary">
                                  {target.toFixed(1)}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground">Benchmark</div>
                                <div className="text-xl font-bold text-muted-foreground">
                                  {benchmark.toFixed(1)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Target Achievement</span>
                                <span className={achievement >= 100 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                  {achievement.toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(achievement, 100)} 
                                className="h-2"
                              />
                            </div>
                            
                            {benchmark > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center justify-between text-sm">
                                  <span>vs Industry Benchmark</span>
                                  <span className={`flex items-center gap-1 ${vsbenchmark > 0 ? "text-green-600" : "text-destructive"}`}>
                                    {vsbenchmark > 0 ? (
                                      <TrendingUp className="h-3 w-3" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(vsbenchmark).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {metric.notes && (
                              <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                                <strong>Notes:</strong> {metric.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* SLA Performance Summary */}
            {slaMetrics.length > 0 && (
              <>
                <Separator />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      SLA Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {slaMetrics.filter((sla: any) => sla.status === "met").length}
                        </div>
                        <div className="text-sm text-muted-foreground">SLAs Met</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">
                          {slaMetrics.filter((sla: any) => sla.status === "missed").length}
                        </div>
                        <div className="text-sm text-muted-foreground">SLAs Missed</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {slaMetrics.filter((sla: any) => sla.status === "at_risk").length}
                        </div>
                        <div className="text-sm text-muted-foreground">At Risk</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}