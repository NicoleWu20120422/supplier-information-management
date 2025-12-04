import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useAlerts, useMarkAlertAsRead } from "@/hooks/use-suppliers";
import { ALERT_SEVERITIES } from "@/lib/constants";

export default function RiskAlerts() {
  const { data: alerts } = useAlerts();
  const markAsRead = useMarkAlertAsRead();

  const unreadAlerts = alerts?.filter(alert => alert.isRead === 0) || [];
  const highRiskAlerts = unreadAlerts.filter(alert => alert.severity === "high" || alert.severity === "critical");

  if (highRiskAlerts.length === 0) return null;

  const handleDismiss = (alertId: string) => {
    markAsRead.mutate(alertId);
  };

  return (
    <div className="mb-6" data-testid="risk-alerts">
      {highRiskAlerts.slice(0, 3).map((alert) => {
        const severity = ALERT_SEVERITIES[alert.severity];
        
        return (
          <Alert 
            key={alert.id} 
            className={`mb-4 bg-${severity.color}/10 border-${severity.color}/20`}
            data-testid={`alert-${alert.id}`}
          >
            <AlertTriangle className={`h-4 w-4 text-${severity.color}`} />
            <div className="flex items-center justify-between flex-1">
              <div>
                <AlertDescription className="font-semibold text-foreground">
                  {alert.title}
                </AlertDescription>
                <AlertDescription className={`text-sm text-${severity.color}/80 mt-1`}>
                  {alert.description}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(alert.id)}
                className={`text-${severity.color} hover:text-${severity.color}/80`}
                data-testid={`dismiss-alert-${alert.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}
