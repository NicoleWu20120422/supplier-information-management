import { useForm } from "react-hook-form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { insertSupplierSchema, type InsertSupplier, type Supplier } from "@shared/schema";
import { useCreateSupplier, useUpdateSupplier } from "@/hooks/use-suppliers";
import { useToast } from "@/hooks/use-toast";
import { SUPPLIER_SEGMENTS, SUPPLIER_COMPLEXITY, MARKET_AVAILABILITY, BUSINESS_CRITICALITY, RELATIONSHIP_TYPE, getSegmentRecommendation, type SupplierCriteria } from "@/lib/constants";

interface SupplierFormProps {
  supplier?: Supplier;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const { toast } = useToast();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const [segmentRecommendation, setSegmentRecommendation] = React.useState<ReturnType<typeof getSegmentRecommendation> | null>(null);

  const form = useForm<InsertSupplier>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: supplier ? {
      name: supplier.name,
      category: supplier.category,
      annualSpend: supplier.annualSpend,
      riskScore: supplier.riskScore,
      performanceScore: supplier.performanceScore,
      innovationPotential: supplier.innovationPotential,
      supplierComplexity: supplier.supplierComplexity,
      marketAvailability: supplier.marketAvailability,
      businessCriticality: supplier.businessCriticality,
      relationshipType: supplier.relationshipType,
      contactInfo: supplier.contactInfo,
      tags: supplier.tags,
      notes: supplier.notes,
    } : {
      name: "",
      category: "",
      annualSpend: "0",
      riskScore: "1.0",
      performanceScore: "50.0",
      innovationPotential: 1,
      supplierComplexity: "low",
      marketAvailability: "many_alternatives",
      businessCriticality: "routine",
      relationshipType: "transactional",
      contactInfo: {},
      tags: [],
      notes: "",
    },
  });

  const onSubmit = async (data: InsertSupplier) => {
    try {
      if (supplier) {
        await updateSupplier.mutateAsync({ id: supplier.id, ...data });
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        });
      } else {
        await createSupplier.mutateAsync(data);
        toast({
          title: "Success",
          description: "Supplier created successfully",
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save supplier",
        variant: "destructive",
      });
    }
  };

  const isPending = createSupplier.isPending || updateSupplier.isPending;

  // Watch form values and calculate score in real-time
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.riskScore && value.performanceScore && value.innovationPotential && 
          value.supplierComplexity && value.marketAvailability && 
          value.businessCriticality && value.relationshipType) {
        
        const criteria: SupplierCriteria = {
          riskScore: parseFloat(value.riskScore),
          performanceScore: parseFloat(value.performanceScore),
          innovationPotential: value.innovationPotential,
          supplierComplexity: value.supplierComplexity as keyof typeof SUPPLIER_COMPLEXITY,
          marketAvailability: value.marketAvailability as keyof typeof MARKET_AVAILABILITY,
          businessCriticality: value.businessCriticality as keyof typeof BUSINESS_CRITICALITY,
          relationshipType: value.relationshipType as keyof typeof RELATIONSHIP_TYPE,
        };

        const recommendation = getSegmentRecommendation(criteria);
        setSegmentRecommendation(recommendation);
        
        // Note: Segment type is now auto-calculated by backend
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card data-testid="supplier-form">
      <CardHeader>
        <CardTitle>{supplier ? "Edit Supplier" : "Add New Supplier"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Scoring Display */}
            {segmentRecommendation && (
              <Card className="bg-muted/20 border-2 border-primary/20" data-testid="scoring-display">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Calculator className="w-5 h-5 mr-2" />
                    AI-Powered Segmentation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Score</span>
                        <span className="text-2xl font-bold text-primary">
                          {segmentRecommendation.totalScore}/100
                        </span>
                      </div>
                      <Progress value={segmentRecommendation.totalScore} className="h-3" />
                      
                      {/* Confidence Badge */}
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={segmentRecommendation.confidence === "high" ? "default" : 
                                  segmentRecommendation.confidence === "medium" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {segmentRecommendation.confidence.toUpperCase()} CONFIDENCE
                        </Badge>
                        {segmentRecommendation.confidence === "high" ? 
                          <Target className="w-4 h-4 text-primary" /> :
                          segmentRecommendation.confidence === "medium" ? 
                          <TrendingUp className="w-4 h-4 text-chart-4" /> :
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        }
                      </div>
                    </div>

                    {/* Recommended Segment */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Recommended Segment</span>
                      <Badge 
                        className={`text-sm p-2 bg-${SUPPLIER_SEGMENTS[segmentRecommendation.segment].color}/10 text-${SUPPLIER_SEGMENTS[segmentRecommendation.segment].color} border-${SUPPLIER_SEGMENTS[segmentRecommendation.segment].color}`}
                      >
                        {SUPPLIER_SEGMENTS[segmentRecommendation.segment].label}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {segmentRecommendation.reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-sm font-medium mb-3 block">Score Breakdown</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Performance</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.performance}/25</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Risk</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.risk}/20</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Innovation</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.innovation}/15</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Criticality</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.criticality}/15</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Relationship</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.relationship}/10</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Market</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.market}/10</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Complexity</div>
                        <div className="text-sm font-medium">{segmentRecommendation.scoreBreakdown.complexity}/5</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology, Raw Materials" {...field} data-testid="input-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="segmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Segment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-segment-type">
                          <SelectValue placeholder="Select supplier segment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(SUPPLIER_SEGMENTS).map(([key, segment]) => (
                          <SelectItem key={key} value={key}>
                            {segment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualSpend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Spend ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} data-testid="input-annual-spend" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Score (1-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="1" 
                        max="10" 
                        placeholder="1.0" 
                        {...field} 
                        data-testid="input-risk-score"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="performanceScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Score (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="100" 
                        placeholder="50.0" 
                        {...field} 
                        data-testid="input-performance-score"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="innovationPotential"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Innovation Potential (1-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10" 
                        placeholder="1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-innovation-potential"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierComplexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Complexity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-supplier-complexity">
                          <SelectValue placeholder="Select complexity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(SUPPLIER_COMPLEXITY).map(([key, complexity]) => (
                          <SelectItem key={key} value={key}>
                            {complexity.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-market-availability">
                          <SelectValue placeholder="Select market availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(MARKET_AVAILABILITY).map(([key, availability]) => (
                          <SelectItem key={key} value={key}>
                            {availability.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessCriticality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Criticality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-business-criticality">
                          <SelectValue placeholder="Select business criticality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(BUSINESS_CRITICALITY).map(([key, criticality]) => (
                          <SelectItem key={key} value={key}>
                            {criticality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationshipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-relationship-type">
                          <SelectValue placeholder="Select relationship type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(RELATIONSHIP_TYPE).map(([key, relationship]) => (
                          <SelectItem key={key} value={key}>
                            {relationship.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about the supplier..." 
                      className="min-h-20"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                data-testid="button-submit"
              >
                {isPending ? "Saving..." : supplier ? "Update Supplier" : "Create Supplier"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
