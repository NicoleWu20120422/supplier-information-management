import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, MoreVertical, Search, Download, Building } from "lucide-react";
import { useSuppliers } from "@/hooks/use-suppliers";
import { SUPPLIER_SEGMENTS, getRiskLevel, RISK_LEVELS, formatCurrency, formatPercentage } from "@/lib/constants";
import type { Supplier } from "@shared/schema";
import { Link } from "wouter";

interface SupplierTableProps {
  onEdit?: (supplier: Supplier) => void;
  onView?: (supplier: Supplier) => void;
}

export default function SupplierTable({ onEdit, onView }: SupplierTableProps) {
  const { data: suppliers, isLoading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSuppliers = suppliers?.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuadrant = selectedQuadrant === "all" || supplier.segmentType === selectedQuadrant;
    
    return matchesSearch && matchesQuadrant;
  }) || [];

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const exportData = () => {
    if (!filteredSuppliers.length) return;
    
    const csv = [
      ['Name', 'Category', 'Segment', 'Annual Spend', 'Risk Score', 'Performance', 'Complexity', 'Market Availability', 'Business Criticality', 'Relationship Type'],
      ...filteredSuppliers.map(s => [
        s.name,
        s.category,
        s.segmentType,
        s.annualSpend,
        s.riskScore,
        s.performanceScore,
        s.supplierComplexity,
        s.marketAvailability,
        s.businessCriticality,
        s.relationshipType
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading suppliers...</div>;
  }

  return (
    <div className="space-y-4" data-testid="supplier-table">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Supplier Database</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
              data-testid="search-input"
            />
          </div>
          
          <Select value={selectedQuadrant} onValueChange={setSelectedQuadrant}>
            <SelectTrigger className="w-48" data-testid="segment-filter">
              <SelectValue placeholder="All Segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              {Object.entries(SUPPLIER_SEGMENTS).map(([key, segment]) => (
                <SelectItem key={key} value={key}>
                  {segment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={exportData} data-testid="export-button">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Annual Spend</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSuppliers.map((supplier) => {
              const segment = SUPPLIER_SEGMENTS[supplier.segmentType];
              const riskLevel = getRiskLevel(parseFloat(supplier.riskScore));
              const riskStyle = RISK_LEVELS[riskLevel];
              
              return (
                <TableRow key={supplier.id} className="hover:bg-muted/50" data-testid={`supplier-row-${supplier.id}`}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{supplier.name}</p>
                        <p className="text-xs text-muted-foreground">{supplier.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`bg-${segment.color}/10 text-${segment.color}`}
                      data-testid={`segment-badge-${supplier.id}`}
                    >
                      {segment.label}
                    </Badge>
                  </TableCell>
                  
                  <TableCell data-testid={`annual-spend-${supplier.id}`}>
                    {formatCurrency(supplier.annualSpend)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium text-${riskStyle.color}`}>
                        {supplier.riskScore}
                      </span>
                      <Progress 
                        value={parseFloat(supplier.riskScore) * 10} 
                        className="w-16 h-2"
                        data-testid={`risk-progress-${supplier.id}`}
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-chart-3">
                        {formatPercentage(supplier.performanceScore)}
                      </span>
                      <Progress 
                        value={parseFloat(supplier.performanceScore)} 
                        className="w-16 h-2"
                        data-testid={`performance-progress-${supplier.id}`}
                      />
                    </div>
                  </TableCell>
                  
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Link to={`/suppliers/${supplier.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`view-supplier-${supplier.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(supplier)}
                        data-testid={`edit-supplier-${supplier.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`more-actions-${supplier.id}`}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between" data-testid="pagination">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              data-testid="prev-page"
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  data-testid={`page-${pageNum}`}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              data-testid="next-page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
