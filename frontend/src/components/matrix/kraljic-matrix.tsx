import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { useSuppliers, useUpdateSupplier } from "@/hooks/use-suppliers";
import { SUPPLIER_SEGMENTS, SUPPLIER_COMPLEXITY, MARKET_AVAILABILITY, BUSINESS_CRITICALITY, RELATIONSHIP_TYPE, RISK_LEVELS, getRiskLevel } from "@/lib/constants";
import type { Supplier } from "@shared/schema";

interface SupplierDotProps {
  supplier: Supplier;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

function SupplierDot({ supplier, onPositionChange }: SupplierDotProps) {
  const [isDragging, setIsDragging] = useState(false);
  const riskLevel = getRiskLevel(parseFloat(supplier.riskScore));
  const riskStyle = RISK_LEVELS[riskLevel];

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement).closest('.matrix-quadrant')?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      
      onPositionChange(supplier.id, { x, y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`supplier-dot ${riskStyle.className} ${isDragging ? 'dragging' : ''}`}
      style={{
        top: `${supplier.matrixPosition.y}%`,
        left: `${supplier.matrixPosition.x}%`,
      }}
      onMouseDown={handleMouseDown}
      title={`${supplier.name} - ${supplier.category}`}
      data-testid={`supplier-dot-${supplier.id}`}
    />
  );
}

export default function KraljicMatrix() {
  const { data: suppliers } = useSuppliers();
  const updateSupplier = useUpdateSupplier();

  const handlePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    // Determine quadrant based on position
    let newQuadrant: "strategic" | "leverage" | "bottleneck" | "non-critical";
    
    if (position.x > 50 && position.y > 50) {
      newQuadrant = "strategic";
    } else if (position.x > 50 && position.y <= 50) {
      newQuadrant = "leverage";
    } else if (position.x <= 50 && position.y > 50) {
      newQuadrant = "bottleneck";
    } else {
      newQuadrant = "non-critical";
    }

    updateSupplier.mutate({
      id,
      matrixPosition: position,
      quadrant: newQuadrant,
    });
  }, [updateSupplier]);

  const quadrantSuppliers = (quadrant: string) => 
    suppliers?.filter(s => s.quadrant === quadrant) || [];

  const exportMatrix = () => {
    if (!suppliers) return;
    
    const data = suppliers.map(s => ({
      name: s.name,
      quadrant: s.quadrant,
      riskScore: s.riskScore,
      performance: s.performanceScore,
      annualSpend: s.annualSpend,
    }));
    
    const csv = [
      ['Name', 'Quadrant', 'Risk Score', 'Performance', 'Annual Spend'],
      ...data.map(s => [s.name, s.quadrant, s.riskScore, s.performance, s.annualSpend])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kraljic-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-border shadow-sm" data-testid="kraljic-matrix">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Supplier Segmentation Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={exportMatrix}
              data-testid="export-matrix-button"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="default" size="sm" data-testid="edit-matrix-button">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative" data-testid="matrix-container">
          {/* Matrix Labels */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
            Profit Impact →
          </div>
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground">
            Supply Risk →
          </div>

          {/* Matrix Grid */}
          <div className="matrix-grid rounded-lg overflow-hidden">
            {/* Strategic Quadrant */}
            <div className={`matrix-quadrant p-4 ${QUADRANTS.strategic.bgClass}`} data-testid="quadrant-strategic">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-semibold text-${QUADRANTS.strategic.color}`}>
                  {QUADRANTS.strategic.label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {quadrantSuppliers('strategic').length} suppliers
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {QUADRANTS.strategic.description}
              </p>
              
              {quadrantSuppliers('strategic').map(supplier => (
                <SupplierDot
                  key={supplier.id}
                  supplier={supplier}
                  onPositionChange={handlePositionChange}
                />
              ))}
            </div>

            {/* Leverage Quadrant */}
            <div className={`matrix-quadrant p-4 ${QUADRANTS.leverage.bgClass}`} data-testid="quadrant-leverage">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-semibold text-${QUADRANTS.leverage.color}`}>
                  {QUADRANTS.leverage.label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {quadrantSuppliers('leverage').length} suppliers
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {QUADRANTS.leverage.description}
              </p>
              
              {quadrantSuppliers('leverage').map(supplier => (
                <SupplierDot
                  key={supplier.id}
                  supplier={supplier}
                  onPositionChange={handlePositionChange}
                />
              ))}
            </div>

            {/* Bottleneck Quadrant */}
            <div className={`matrix-quadrant p-4 ${QUADRANTS.bottleneck.bgClass}`} data-testid="quadrant-bottleneck">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-semibold text-${QUADRANTS.bottleneck.color}`}>
                  {QUADRANTS.bottleneck.label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {quadrantSuppliers('bottleneck').length} suppliers
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {QUADRANTS.bottleneck.description}
              </p>
              
              {quadrantSuppliers('bottleneck').map(supplier => (
                <SupplierDot
                  key={supplier.id}
                  supplier={supplier}
                  onPositionChange={handlePositionChange}
                />
              ))}
            </div>

            {/* Non-Critical Quadrant */}
            <div className={`matrix-quadrant p-4 ${QUADRANTS["non-critical"].bgClass}`} data-testid="quadrant-non-critical">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-semibold text-${QUADRANTS["non-critical"].color}`}>
                  {QUADRANTS["non-critical"].label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {quadrantSuppliers('non-critical').length} suppliers
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {QUADRANTS["non-critical"].description}
              </p>
              
              {quadrantSuppliers('non-critical').map(supplier => (
                <SupplierDot
                  key={supplier.id}
                  supplier={supplier}
                  onPositionChange={handlePositionChange}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6" data-testid="matrix-legend">
            {Object.entries(RISK_LEVELS).map(([key, risk]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${risk.className}`} />
                <span className="text-xs text-muted-foreground">{risk.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
