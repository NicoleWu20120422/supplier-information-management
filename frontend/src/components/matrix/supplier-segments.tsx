import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useSuppliers } from "@/hooks/use-suppliers";
import { SUPPLIER_SEGMENTS, RISK_LEVELS, getRiskLevel, formatCurrency, formatPercentage } from "@/lib/constants";
import type { Supplier } from "@shared/schema";

interface SegmentCardProps {
  segmentKey: string;
  segment: typeof SUPPLIER_SEGMENTS[keyof typeof SUPPLIER_SEGMENTS];
  suppliers: Supplier[];
}

function SegmentCard({ segmentKey, segment, suppliers }: SegmentCardProps) {
  const segmentSuppliers = suppliers.filter(s => s.segmentType === segmentKey);
  
  // Helper to safely convert values to numbers
  const toNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    const parsed = parseFloat(String(val || 0));
    return isNaN(parsed) ? 0 : parsed;
  };
  
  const totalSpend = segmentSuppliers.reduce((sum, s) => sum + toNumber(s.annualSpend), 0);
  const avgRiskScore = segmentSuppliers.length > 0 
    ? segmentSuppliers.reduce((sum, s) => sum + toNumber(s.riskScore), 0) / segmentSuppliers.length 
    : 0;
  const avgPerformance = segmentSuppliers.length > 0 
    ? segmentSuppliers.reduce((sum, s) => sum + toNumber(s.performanceScore), 0) / segmentSuppliers.length 
    : 0;

  const riskLevel = getRiskLevel(avgRiskScore);
  const riskStyle = RISK_LEVELS[riskLevel];

  return (
    <Card className={`border-l-4 border-l-${segment.color} ${segment.bgClass} hover:shadow-md transition-all duration-200`} data-testid={`segment-card-${segmentKey}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg font-bold text-${segment.color}`}>
              {segment.label}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {segment.description}
            </p>
          </div>
          <Badge variant="outline" className={`text-${segment.color} border-${segment.color}`}>
            {segmentSuppliers.length} suppliers
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Spend</p>
              <p className="text-lg font-semibold">{formatCurrency(totalSpend)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg Performance</p>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-chart-3">
                  {formatPercentage(avgPerformance)}
                </span>
                {avgPerformance >= 90 ? <TrendingUp className="w-4 h-4 text-chart-3" /> :
                 avgPerformance >= 75 ? <Minus className="w-4 h-4 text-chart-4" /> :
                 <TrendingDown className="w-4 h-4 text-destructive" />}
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Average Risk Score</p>
              <span className={`text-sm font-medium text-${riskStyle.color}`}>
                {avgRiskScore.toFixed(1)}
              </span>
            </div>
            <Progress 
              value={avgRiskScore * 10} 
              className={`h-2 bg-${riskStyle.color}/10`}
            />
          </div>

          {/* Characteristics */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Characteristics:</p>
            <p className="text-xs text-foreground">{segment.characteristics}</p>
          </div>

          {/* Management Approach */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Management:</p>
            <p className="text-xs text-foreground">{segment.management}</p>
          </div>

          {/* Top Suppliers */}
          {segmentSuppliers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Key Suppliers:</p>
              <div className="space-y-1">
                {segmentSuppliers.slice(0, 3).map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate">{supplier.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(supplier.annualSpend)}
                    </span>
                  </div>
                ))}
              </div>
              {segmentSuppliers.length > 3 && (
                <Button variant="ghost" size="sm" className="h-6 text-xs p-1">
                  <Eye className="w-3 h-3 mr-1" />
                  View all {segmentSuppliers.length} suppliers
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SupplierSegments() {
  // Fetch suppliers data with loading and error state handling
  const { data: suppliers, isLoading, error } = useSuppliers();

  const exportSegments = () => {
    if (!suppliers) return;
    
    const data = suppliers.map(s => ({
      name: s.name,
      segment: s.segmentType,
      category: s.category,
      riskScore: s.riskScore,
      performance: s.performanceScore,
      annualSpend: s.annualSpend,
      complexity: s.supplierComplexity,
      marketAvailability: s.marketAvailability,
      businessCriticality: s.businessCriticality,
      relationshipType: s.relationshipType,
    }));
    
    const csv = [
      ['Name', 'Segment', 'Category', 'Risk Score', 'Performance', 'Annual Spend', 'Complexity', 'Market Availability', 'Business Criticality', 'Relationship Type'],
      ...data.map(s => [s.name, s.segment, s.category, s.riskScore, s.performance, s.annualSpend, s.complexity, s.marketAvailability, s.businessCriticality, s.relationshipType])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplier-segmentation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle loading state - show loading indicator while fetching supplier data
  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm" data-testid="supplier-segments-loading">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Supplier Segmentation Overview</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Loading supplier segments...
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Fetching supplier segment data from backend...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state - show error message if data fetch fails
  if (error) {
    return (
      <Card className="border border-destructive shadow-sm" data-testid="supplier-segments-error">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-destructive">Error Loading Supplier Segments</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Failed to fetch supplier segment data
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              Unable to load supplier segments from backend API
            </p>
            <p className="text-xs text-muted-foreground">
              Error: {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Please check that the backend API is running and accessible.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state - no suppliers available
  if (!suppliers || suppliers.length === 0) {
    return (
      <Card className="border border-border shadow-sm" data-testid="supplier-segments-empty">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Supplier Segmentation Overview</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            No supplier data available
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No suppliers found. Add suppliers to see segmentation data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm" data-testid="supplier-segments">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Supplier Segmentation Overview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced supplier categorization based on multiple criteria
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={exportSegments}
            data-testid="export-segments-button"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="segments-grid">
          {Object.entries(SUPPLIER_SEGMENTS).map(([key, segment]) => (
            <SegmentCard
              key={key}
              segmentKey={key}
              segment={segment}
              suppliers={suppliers}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}