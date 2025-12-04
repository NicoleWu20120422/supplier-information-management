import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { type Supplier } from "@shared/schema";
import { SupplyChainMap } from "@/components/suppliers/supply-chain-map";
import { FinancialHealth } from "@/components/suppliers/financial-health";
import { PerformanceAnalytics } from "@/components/suppliers/performance-analytics";
import { EnhancedAlerts } from "@/components/suppliers/enhanced-alerts";

const getSegmentColor = (segmentType: string) => {
  switch (segmentType) {
    case "innovative_partnerships":
      return "bg-blue-500 text-white";
    case "trusted_suppliers":
      return "bg-green-500 text-white";
    case "switch_candidates":
      return "bg-yellow-500 text-black";
    case "commodity_partnerships":
      return "bg-red-500 text-white";
    case "proprietary_information":
      return "bg-purple-500 text-white";
    case "supplier_integration":
      return "bg-indigo-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const formatSegmentName = (segmentType: string) => {
  return segmentType.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default function SupplierDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  const supplierId = params.id;
  
  const { data: supplier, isLoading } = useQuery<Supplier>({
    queryKey: ["/api/suppliers", supplierId],
    enabled: !!supplierId
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Supplier Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The supplier you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/suppliers">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="supplier-detail-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/suppliers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="supplier-name">
              {supplier.name}
            </h1>
            <p className="text-muted-foreground">{supplier.category}</p>
          </div>
        </div>
        
        <Button onClick={() => setLocation(`/suppliers/${supplier.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Supplier
        </Button>
      </div>

      {/* Supplier Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Segment Type</div>
              <Badge className={`mt-1 ${getSegmentColor(supplier.segmentType)}`}>
                {formatSegmentName(supplier.segmentType)}
              </Badge>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Annual Spend</div>
              <div className="text-xl font-bold mt-1" data-testid="annual-spend">
                ${parseFloat(supplier.annualSpend).toLocaleString()}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className={`text-xl font-bold mt-1 ${
                parseFloat(supplier.riskScore) > 8 ? "text-destructive" : 
                parseFloat(supplier.riskScore) > 5 ? "text-yellow-600" : "text-green-600"
              }`}>
                {parseFloat(supplier.riskScore).toFixed(1)}/10
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Performance Score</div>
              <div className={`text-xl font-bold mt-1 ${
                parseFloat(supplier.performanceScore) >= 80 ? "text-green-600" : 
                parseFloat(supplier.performanceScore) >= 60 ? "text-yellow-600" : "text-destructive"
              }`}>
                {parseFloat(supplier.performanceScore).toFixed(1)}%
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Supplier Characteristics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity:</span>
                  <span className="capitalize">{supplier.supplierComplexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Availability:</span>
                  <span className="capitalize">{supplier.marketAvailability.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Criticality:</span>
                  <span className="capitalize">{supplier.businessCriticality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Relationship Type:</span>
                  <span className="capitalize">{supplier.relationshipType}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                {supplier.contactInfo?.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{supplier.contactInfo.email}</span>
                  </div>
                )}
                {supplier.contactInfo?.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{supplier.contactInfo.phone}</span>
                  </div>
                )}
                {supplier.contactInfo?.address && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="text-right max-w-[200px]">{supplier.contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {supplier.notes && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{supplier.notes}</p>
              </div>
            </>
          )}

          {supplier.tags && supplier.tags.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Advanced Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="costs">Costs & SLA</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceAnalytics 
              supplierId={supplier.id} 
              supplierName={supplier.name} 
            />
            <EnhancedAlerts 
              supplierId={supplier.id} 
              supplierName={supplier.name} 
            />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialHealth 
            supplierId={supplier.id} 
            supplierName={supplier.name} 
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceAnalytics 
            supplierId={supplier.id} 
            supplierName={supplier.name} 
          />
        </TabsContent>

        <TabsContent value="supply-chain" className="space-y-6">
          <SupplyChainMap 
            supplierId={supplier.id} 
            supplierName={supplier.name} 
          />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">Cost Analysis & SLA Monitoring</h3>
            <p>Advanced cost tracking and SLA monitoring features coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <EnhancedAlerts 
            supplierId={supplier.id} 
            supplierName={supplier.name} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}