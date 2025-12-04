import MetricsCards from "@/components/dashboard/metrics-cards";
import RiskAlerts from "@/components/dashboard/risk-alerts";
import SupplierSegments from "@/components/matrix/supplier-segments";
import Charts from "@/components/analytics/charts";
import SupplierTable from "@/components/suppliers/supplier-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSuppliers } from "@/hooks/use-suppliers";
import { SUPPLIER_SEGMENTS, getRiskLevel, RISK_LEVELS, formatCurrency, formatPercentage } from "@/lib/constants";

function SupplierInsights() {
  const { data: suppliers } = useSuppliers();

  const topRiskSuppliers = suppliers
    ?.filter(s => parseFloat(s.riskScore) >= 7)
    .sort((a, b) => parseFloat(b.riskScore) - parseFloat(a.riskScore))
    .slice(0, 3) || [];

  const topPerformers = suppliers
    ?.sort((a, b) => parseFloat(b.performanceScore) - parseFloat(a.performanceScore))
    .slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Top Risk Suppliers */}
      <Card className="border border-border shadow-sm" data-testid="top-risk-suppliers">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Risk Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRiskSuppliers.map((supplier) => {
              const riskLevel = getRiskLevel(parseFloat(supplier.riskScore));
              const riskStyle = RISK_LEVELS[riskLevel];
              const segment = SUPPLIER_SEGMENTS[supplier.segmentType];
              
              return (
                <div
                  key={supplier.id}
                  className={`flex items-center justify-between p-3 bg-${riskStyle.color}/5 rounded-lg border border-${riskStyle.color}/20`}
                  data-testid={`risk-supplier-${supplier.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 bg-${riskStyle.color} rounded-full`} />
                    <div>
                      <p className="font-medium text-foreground text-sm">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {segment.label} • {formatCurrency(supplier.annualSpend)} annual
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold text-${riskStyle.color}`}>
                      {supplier.riskScore}
                    </span>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="link" className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
            View all high-risk suppliers →
          </Button>
        </CardContent>
      </Card>

      {/* Performance Leaders */}
      <Card className="border border-border shadow-sm" data-testid="performance-leaders">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance Leaders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((supplier) => {
              const segment = SUPPLIER_SEGMENTS[supplier.segmentType];
              
              return (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-3 bg-chart-3/10 rounded-lg border border-chart-3/20"
                  data-testid={`top-performer-${supplier.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-chart-3 rounded-full" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {segment.label} • {formatCurrency(supplier.annualSpend)} annual
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-chart-3">
                      {formatPercentage(supplier.performanceScore)}
                    </span>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="link" className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
            View performance rankings →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="dashboard">
      <RiskAlerts />
      <MetricsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SupplierSegments />
        </div>
        <div>
          <SupplierInsights />
        </div>
      </div>

      <Charts />
      <SupplierTable />
    </div>
  );
}
