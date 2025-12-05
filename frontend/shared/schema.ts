import { z } from "zod";

// Example: API shape for creating a supplier
export const insertSupplierSchema = z.object({
  name: z.string(),
  category: z.string(),
  segmentType: z.string(),
  annualSpend: z.union([z.number(), z.string()]).optional().transform(val => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }),
  riskScore: z.union([z.number(), z.string()]).optional().transform(val => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }),
  performanceScore: z.union([z.number(), z.string()]).optional().transform(val => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }),
  innovationPotential: z.number().optional(),
  supplierComplexity: z.string().optional(),
  marketAvailability: z.string().optional(),
  businessCriticality: z.string().optional(),
  relationshipType: z.string().optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

// Example response type (what your API returns to frontend)
// Backend returns Id as int, but we'll accept both string and number
export const supplierSchema = insertSupplierSchema.extend({
  id: z.union([z.string(), z.number()]).transform(val => String(val)),
  createdAt: z.string().optional(), // or change to z.date()
  updatedAt: z.string().optional(),
});
export type Supplier = z.infer<typeof supplierSchema>;

// Example: alert schema
export const alertSchema = z.object({
  id: z.string(),
  supplierId: z.string(),
  type: z.string(),
  severity: z.string(),
  title: z.string(),
  description: z.string(),
  isRead: z.boolean(),
  createdAt: z.string().optional()
});
export type Alert = z.infer<typeof alertSchema>;

// Example: update supplier API object
export const supplierUpdateSchema = insertSupplierSchema.partial();
export type UpdateSupplier = z.infer<typeof supplierUpdateSchema>;

// Add similar schemas for other API contract objects as needed...