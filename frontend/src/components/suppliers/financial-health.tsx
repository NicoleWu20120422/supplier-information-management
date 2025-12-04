import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  Shield, 
  Activity,
  CreditCard,
  Building2
} from "lucide-react";

interface FinancialHealthProps {
  supplierId: string;
  supplierName: string;
}

const getCreditRatingColor = (rating: string) => {
  switch (rating) {
    case "AAA":
    case "AA":
    case "A": return "text-green-600";
    case "BBB":
    case "BB": return "text-yellow-600";
    case "B":
    case "CCC":
    case "CC":
    case "C": return "text-orange-600";
    case "D": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const getStabilityColor = (stability: string) => {
  switch (stability) {
    case "excellent": return "text-green-600";
    case "good": return "text-green-500";
    case "fair": return "text-yellow-600";
    case "poor": return "text-orange-600";
    case "critical": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const getCreditScoreColor = (score: number) => {
  if (score >= 750) return "text-green-600";
  if (score >= 650) return "text-yellow-600";
  return "text-destructive";
};

export function FinancialHealth({ supplierId, supplierName }: FinancialHealthProps) {
  const { data: financials = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/suppliers", supplierId, "financials"],
    enabled: !!supplierId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Health
          </CardTitle>
          <CardDescription>
            Loading financial data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const latest = financials.sort((a: any, b: any) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  )[0];

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Health
          </CardTitle>
          <CardDescription>
            Financial health monitoring for {supplierName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No financial data available</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              data-testid="button-add-financial-data"
            >
              Add Financial Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const bankruptcyRisk = parseFloat(latest.bankruptcyRisk || "0");
  const debtToEquity = parseFloat(latest.debtToEquity || "0");
  const liquidityRatio = parseFloat(latest.liquidityRatio || "0");
  const profitMargin = parseFloat(latest.profitMargin || "0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Health
        </CardTitle>
        <CardDescription>
          Financial stability assessment for {supplierName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credit Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Credit Rating</div>
                  <div className={`text-2xl font-bold ${getCreditRatingColor(latest.creditRating)}`}>
                    {latest.creditRating || "N/A"}
                  </div>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Credit Score</div>
                  <div className={`text-2xl font-bold ${getCreditScoreColor(latest.creditScore || 0)}`}>
                    {latest.creditScore || "N/A"}
                  </div>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              {latest.creditScore && (
                <div className="mt-2">
                  <Progress 
                    value={(latest.creditScore / 850) * 100} 
                    className="h-2" 
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Bankruptcy Risk</div>
                  <div className={`text-2xl font-bold ${bankruptcyRisk > 15 ? 'text-destructive' : bankruptcyRisk > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {bankruptcyRisk.toFixed(1)}%
                  </div>
                </div>
                {bankruptcyRisk > 10 ? (
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                ) : (
                  <Shield className="h-8 w-8 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Financial Stability */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Financial Stability</h3>
            <Badge 
              variant={latest.financialStability === "excellent" || latest.financialStability === "good" ? "default" : 
                      latest.financialStability === "fair" ? "secondary" : "destructive"}
              data-testid={`badge-stability-${latest.financialStability}`}
            >
              <Activity className="h-3 w-3 mr-1" />
              {latest.financialStability?.toUpperCase() || "UNKNOWN"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue & Profitability */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Revenue & Profitability</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Annual Revenue</span>
                  <span className="font-medium" data-testid="text-revenue">
                    ${parseFloat(latest.revenue || "0").toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profit Margin</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${profitMargin >= 10 ? 'text-green-600' : profitMargin >= 5 ? 'text-yellow-600' : 'text-destructive'}`}>
                      {profitMargin.toFixed(1)}%
                    </span>
                    {profitMargin >= 5 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Ratios */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Financial Ratios</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Debt to Equity</span>
                  <span className={`font-medium ${debtToEquity <= 1 ? 'text-green-600' : debtToEquity <= 2 ? 'text-yellow-600' : 'text-destructive'}`}>
                    {debtToEquity.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Liquidity Ratio</span>
                  <span className={`font-medium ${liquidityRatio >= 1.5 ? 'text-green-600' : liquidityRatio >= 1 ? 'text-yellow-600' : 'text-destructive'}`}>
                    {liquidityRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        {(bankruptcyRisk > 10 || debtToEquity > 2 || liquidityRatio < 1) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Indicators
              </h3>
              
              <div className="space-y-2 text-sm">
                {bankruptcyRisk > 10 && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span>High bankruptcy risk detected ({bankruptcyRisk.toFixed(1)}%)</span>
                  </div>
                )}
                
                {debtToEquity > 2 && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span>High debt to equity ratio ({debtToEquity.toFixed(2)})</span>
                  </div>
                )}
                
                {liquidityRatio < 1 && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span>Poor liquidity ratio ({liquidityRatio.toFixed(2)})</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Data Source */}
        <Separator />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Data Source: {latest.dataSource}</span>
          <span>Last Updated: {new Date(latest.lastUpdated).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}