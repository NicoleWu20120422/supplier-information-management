import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Bell,
  BellRing,
  Brain,
  User,
  Zap,
  Target
} from "lucide-react";

interface EnhancedAlertsProps {
  supplierId?: string;
  supplierName?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "risk": return <Shield className="h-4 w-4" />;
    case "performance": return <TrendingUp className="h-4 w-4" />;
    case "financial": return <Target className="h-4 w-4" />;
    case "operational": return <Zap className="h-4 w-4" />;
    case "predictive": return <Brain className="h-4 w-4" />;
    case "compliance": return <CheckCircle className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "secondary";
    case "low": return "outline";
    case "info": return "outline";
    default: return "outline";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "system": return <Zap className="h-3 w-3" />;
    case "manual": return <User className="h-3 w-3" />;
    case "integration": return <Target className="h-3 w-3" />;
    case "ml_model": return <Brain className="h-3 w-3" />;
    default: return <Bell className="h-3 w-3" />;
  }
};

const getPriorityScore = (impact: string, urgency: string, severity: string) => {
  const impactScore = impact === "high" ? 3 : impact === "medium" ? 2 : 1;
  const urgencyScore = urgency === "high" ? 3 : urgency === "medium" ? 2 : 1;
  const severityScore = severity === "critical" ? 4 : severity === "high" ? 3 : severity === "medium" ? 2 : 1;
  return impactScore + urgencyScore + severityScore;
};

export function EnhancedAlerts({ supplierId, supplierName }: EnhancedAlertsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/enhanced-alerts"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await fetch(`/api/enhanced-alerts/${alertId}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enhanced-alerts"] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark alert as read. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await fetch(`/api/enhanced-alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enhanced-alerts"] });
      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Enhanced Alerts
          </CardTitle>
          <CardDescription>
            Loading advanced alert system...
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

  // Filter alerts by supplier if specified
  const filteredAlerts = supplierId ? 
    alerts.filter((alert: any) => alert.supplierId === supplierId) : 
    alerts;

  // Sort alerts by priority and recency
  const sortedAlerts = filteredAlerts.sort((a: any, b: any) => {
    const priorityA = getPriorityScore(a.impact, a.urgency, a.severity);
    const priorityB = getPriorityScore(b.impact, b.urgency, b.severity);
    
    if (priorityA !== priorityB) {
      return priorityB - priorityA; // Higher priority first
    }
    
    // If same priority, sort by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unreadAlerts = filteredAlerts.filter((alert: any) => !alert.isRead);
  const criticalAlerts = filteredAlerts.filter((alert: any) => alert.severity === "critical");
  const unresolvedAlerts = filteredAlerts.filter((alert: any) => !alert.isResolved);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Enhanced Alerts
          {unreadAlerts.length > 0 && (
            <Badge variant="destructive">{unreadAlerts.length} unread</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {supplierId ? `Advanced alert monitoring for ${supplierName}` : "System-wide alert management and monitoring"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellRing className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No alerts detected</p>
            <p className="text-sm">All systems are operating normally</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Alert Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Critical</div>
                      <div className="text-xl font-bold text-destructive">
                        {criticalAlerts.length}
                      </div>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Unread</div>
                      <div className="text-xl font-bold text-blue-600">
                        {unreadAlerts.length}
                      </div>
                    </div>
                    <EyeOff className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Open</div>
                      <div className="text-xl font-bold text-yellow-600">
                        {unresolvedAlerts.length}
                      </div>
                    </div>
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-xl font-bold text-green-600">
                        {filteredAlerts.length}
                      </div>
                    </div>
                    <Bell className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Alert List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {sortedAlerts.map((alert: any) => (
                  <Card 
                    key={alert.id} 
                    className={`border-l-4 ${
                      alert.severity === "critical" ? "border-l-red-500 bg-red-50/50" :
                      alert.severity === "high" ? "border-l-orange-500 bg-orange-50/50" :
                      alert.severity === "medium" ? "border-l-yellow-500" :
                      "border-l-blue-500"
                    } ${!alert.isRead ? "shadow-md" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {getCategoryIcon(alert.category)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!alert.isRead ? "font-semibold" : ""}`} 
                                  data-testid={`alert-title-${alert.id}`}>
                                {alert.title}
                              </h4>
                              {!alert.isRead && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {alert.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                {getSourceIcon(alert.source)}
                                {alert.source}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(alert.createdAt).toLocaleString()}
                              </span>
                              {alert.confidence && (
                                <span>
                                  Confidence: {(parseFloat(alert.confidence) * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              I:{alert.impact?.[0]?.toUpperCase() || 'L'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              U:{alert.urgency?.[0]?.toUpperCase() || 'L'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Items */}
                      {alert.actionItems && alert.actionItems.length > 0 && (
                        <div className="mb-3 p-2 bg-muted/50 rounded-md">
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Recommended Actions:
                          </div>
                          <ul className="text-xs space-y-1">
                            {alert.actionItems.map((action: string, index: number) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-muted-foreground">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Alert Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex gap-2">
                          {!alert.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsReadMutation.mutate(alert.id)}
                              disabled={markAsReadMutation.isPending}
                              data-testid={`button-mark-read-${alert.id}`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          
                          {!alert.isResolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlertMutation.mutate(alert.id)}
                              disabled={resolveAlertMutation.isPending}
                              data-testid={`button-resolve-${alert.id}`}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {alert.category} • {alert.subcategory}
                        </div>
                      </div>
                      
                      {alert.isResolved && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-xs text-green-800">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Resolved on {new Date(alert.resolvedAt).toLocaleString()}
                          {alert.resolution && `: ${alert.resolution}`}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}