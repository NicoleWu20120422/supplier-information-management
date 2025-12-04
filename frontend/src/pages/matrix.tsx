import SupplierSegments from "@/components/matrix/supplier-segments";

export default function Matrix() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="matrix-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Supplier Segmentation</h1>
        <p className="text-muted-foreground mt-2">
          Advanced supplier categorization based on multiple business criteria
        </p>
      </div>
      
      <SupplierSegments />
    </div>
  );
}
