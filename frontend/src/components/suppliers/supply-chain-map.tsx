import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  GitBranch, 
  AlertTriangle, 
  Shield, 
  Clock, 
  MapPin,
  Truck,
  Zap
} from "lucide-react";
import { type Supplier } from "@shared/schema";

interface SupplyChainMapProps {
  supplierId: string;
  supplierName: string;
}

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "secondary";
    case "low": return "outline";
    default: return "outline";
  }
};

const getDependencyTypeIcon = (type: string) => {
  switch (type) {
    case "tier1": return <GitBranch className="h-4 w-4" />;
    case "tier2": return <GitBranch className="h-4 w-4 opacity-70" />;
    case "tier3": return <GitBranch className="h-4 w-4 opacity-50" />;
    case "backup": return <Shield className="h-4 w-4" />;
    case "alternative": return <Zap className="h-4 w-4" />;
    default: return <GitBranch className="h-4 w-4" />;
  }
};

export function SupplyChainMap({ supplierId, supplierName }: SupplyChainMapProps) {
  const { data: dependencies = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/suppliers", supplierId, "dependencies"],
    enabled: !!supplierId
  });

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"]
  });

  const getDependentSupplier = (dependentId: string) => {
    return suppliers.find(s => s.id === dependentId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Supply Chain Map
          </CardTitle>
          <CardDescription>
            Loading supply chain dependencies...
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

  const tierGroups = dependencies.reduce((acc: any, dep: any) => {
    const type = dep.dependencyType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(dep);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Supply Chain Map
        </CardTitle>
        <CardDescription>
          Multi-tier supplier dependencies and relationships for {supplierName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {dependencies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No supply chain dependencies mapped</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                data-testid="button-add-dependency"
              >
                Map Dependencies
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(tierGroups as Record<string, any[]>).map(([tier, deps]) => (
                <div key={tier} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getDependencyTypeIcon(tier)}
                    <h3 className="font-semibold capitalize">
                      {tier === "tier1" ? "Tier 1 Suppliers" :
                       tier === "tier2" ? "Tier 2 Suppliers" :
                       tier === "tier3" ? "Tier 3 Suppliers" :
                       tier === "backup" ? "Backup Suppliers" :
                       "Alternative Suppliers"}
                    </h3>
                    <Badge variant="outline">{deps.length}</Badge>
                  </div>
                  
                  <div className="grid gap-3">
                    {deps.map((dependency: any) => {
                      const dependentSupplier = getDependentSupplier(dependency.dependentSupplierId);
                      
                      return (
                        <Card key={dependency.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium" data-testid={`text-supplier-${dependency.dependentSupplierId}`}>
                                  {dependentSupplier?.name || "Unknown Supplier"}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {dependentSupplier?.category || "Unknown Category"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Truck className="h-3 w-3" />
                                    Segment: {dependentSupplier?.segmentType?.replace(/_/g, ' ') || "Unknown"}
                                  </span>
                                </div>
                              </div>
                              
                              <Badge variant={getCriticalityColor(dependency.criticality)}>
                                {dependency.criticality}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Lead Time</div>
                                <div className="flex items-center gap-1 font-medium">
                                  <Clock className="h-3 w-3" />
                                  {dependency.leadTime || 0} days
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-muted-foreground">Capacity</div>
                                <div className="font-medium">
                                  ${parseFloat(dependency.capacity || "0").toLocaleString()}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-muted-foreground">Geographic Risk</div>
                                <div className="flex items-center gap-1">
                                  {dependency.geographicRisk === "high" && (
                                    <AlertTriangle className="h-3 w-3 text-destructive" />
                                  )}
                                  <span className={
                                    dependency.geographicRisk === "high" ? "text-destructive font-medium" :
                                    dependency.geographicRisk === "medium" ? "text-yellow-600 font-medium" :
                                    "text-green-600 font-medium"
                                  }>
                                    {dependency.geographicRisk}
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-muted-foreground">Relationship</div>
                                <div className="font-medium capitalize">
                                  {dependency.dependencyType}
                                </div>
                              </div>
                            </div>
                            
                            {dependency.criticality === "critical" && (
                              <div className="mt-3 p-2 bg-destructive/10 rounded-md flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <span className="text-destructive font-medium">
                                  Critical dependency - requires immediate attention
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  {tier !== Object.keys(tierGroups)[Object.keys(tierGroups).length - 1] && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
              
              {/* Summary Stats */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Supply Chain Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {dependencies.length}
                      </div>
                      <div className="text-muted-foreground">Total Dependencies</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-destructive">
                        {dependencies.filter((d: any) => d.criticality === "critical" || d.criticality === "high").length}
                      </div>
                      <div className="text-muted-foreground">High Risk</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {Math.round(dependencies.reduce((sum: number, d: any) => sum + (d.leadTime || 0), 0) / dependencies.length) || 0}
                      </div>
                      <div className="text-muted-foreground">Avg Lead Time</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {dependencies.filter((d: any) => d.dependencyType === "backup" || d.dependencyType === "alternative").length}
                      </div>
                      <div className="text-muted-foreground">Backup Options</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}