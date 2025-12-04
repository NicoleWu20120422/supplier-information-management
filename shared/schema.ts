import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  segmentType: text("segment_type").notNull().$type<"trusted_suppliers" | "switch_candidates" | "commodity_partnerships" | "innovative_partnerships" | "proprietary_information" | "supplier_integration">(),
  annualSpend: decimal("annual_spend", { precision: 12, scale: 2 }).notNull(),
  riskScore: decimal("risk_score", { precision: 3, scale: 1 }).notNull(),
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }).notNull(),
  innovationPotential: integer("innovation_potential").notNull(),
  supplierComplexity: text("supplier_complexity").notNull().$type<"low" | "medium" | "high">(),
  marketAvailability: text("market_availability").notNull().$type<"many_alternatives" | "limited_alternatives" | "few_alternatives" | "monopolistic">(),
  businessCriticality: text("business_criticality").notNull().$type<"routine" | "important" | "critical" | "strategic">(),
  relationshipType: text("relationship_type").notNull().$type<"transactional" | "collaborative" | "partnership" | "integration">(),
  contactInfo: jsonb("contact_info").$type<{
    email?: string;
    phone?: string;
    address?: string;
  }>(),
  tags: text("tags").array().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  type: text("type").notNull().$type<"risk" | "performance" | "contract" | "compliance">(),
  severity: text("severity").notNull().$type<"low" | "medium" | "high" | "critical">(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isRead: integer("is_read").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  segmentType: true, // Auto-calculated by scoring algorithm
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// Financial Health Monitoring
export const supplierFinancials = pgTable("supplier_financials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull().references(() => suppliers.id),
  creditRating: text("credit_rating").$type<"AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D">(),
  creditScore: integer("credit_score"),
  bankruptcyRisk: decimal("bankruptcy_risk", { precision: 5, scale: 2 }),
  financialStability: text("financial_stability").$type<"excellent" | "good" | "fair" | "poor" | "critical">(),
  revenue: decimal("revenue", { precision: 15, scale: 2 }),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }),
  debtToEquity: decimal("debt_to_equity", { precision: 8, scale: 4 }),
  liquidityRatio: decimal("liquidity_ratio", { precision: 6, scale: 3 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
  dataSource: text("data_source").notNull(), // e.g., "Dun & Bradstreet", "Internal"
  createdAt: timestamp("created_at").defaultNow(),
});

// Supply Chain Mapping
export const supplierDependencies = pgTable("supplier_dependencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  primarySupplierId: varchar("primary_supplier_id").notNull().references(() => suppliers.id),
  dependentSupplierId: varchar("dependent_supplier_id").notNull().references(() => suppliers.id),
  dependencyType: text("dependency_type").$type<"tier1" | "tier2" | "tier3" | "backup" | "alternative">(),
  criticality: text("criticality").$type<"low" | "medium" | "high" | "critical">(),
  leadTime: integer("lead_time"), // in days
  capacity: decimal("capacity", { precision: 12, scale: 2 }),
  geographicRisk: text("geographic_risk").$type<"low" | "medium" | "high">(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance Analytics
export const performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull().references(() => suppliers.id),
  metricType: text("metric_type").$type<"delivery" | "quality" | "cost" | "service" | "innovation" | "compliance">(),
  value: decimal("value", { precision: 10, scale: 4 }),
  target: decimal("target", { precision: 10, scale: 4 }),
  benchmark: decimal("benchmark", { precision: 10, scale: 4 }),
  trend: text("trend").$type<"improving" | "stable" | "declining">(),
  period: text("period").notNull(), // e.g., "2024-Q1", "2024-03"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service Level Agreements
export const slaMetrics = pgTable("sla_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull().references(() => suppliers.id),
  slaType: text("sla_type").$type<"delivery_time" | "quality_rate" | "availability" | "response_time" | "uptime">(),
  target: decimal("target", { precision: 8, scale: 4 }),
  actual: decimal("actual", { precision: 8, scale: 4 }),
  achievement: decimal("achievement", { precision: 5, scale: 2 }), // percentage
  status: text("status").$type<"met" | "missed" | "at_risk">(),
  penaltyApplied: boolean("penalty_applied").default(false),
  penaltyAmount: decimal("penalty_amount", { precision: 12, scale: 2 }),
  period: text("period").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Total Cost of Ownership
export const costAnalysis = pgTable("cost_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull().references(() => suppliers.id),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  logisticsCost: decimal("logistics_cost", { precision: 12, scale: 2 }),
  qualityCost: decimal("quality_cost", { precision: 12, scale: 2 }),
  reworkCost: decimal("rework_cost", { precision: 12, scale: 2 }),
  inventoryCarrying: decimal("inventory_carrying", { precision: 12, scale: 2 }),
  managementCost: decimal("management_cost", { precision: 12, scale: 2 }),
  totalCostOfOwnership: decimal("total_cost_of_ownership", { precision: 12, scale: 2 }),
  period: text("period").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Market Intelligence
export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  marketPrice: decimal("market_price", { precision: 12, scale: 4 }),
  priceVolatility: decimal("price_volatility", { precision: 5, scale: 2 }),
  marketCapacity: decimal("market_capacity", { precision: 15, scale: 2 }),
  competitionLevel: text("competition_level").$type<"low" | "medium" | "high" | "monopolistic">(),
  marketTrend: text("market_trend").$type<"growing" | "stable" | "declining">(),
  seasonality: jsonb("seasonality"),
  geographicFactors: jsonb("geographic_factors"),
  regulatoryImpact: text("regulatory_impact").$type<"positive" | "neutral" | "negative">(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  dataSource: text("data_source").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workflow Management
export const workflows = pgTable("workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").$type<"supplier_onboarding" | "supplier_evaluation" | "contract_approval" | "risk_assessment" | "performance_review">(),
  description: text("description"),
  steps: jsonb("steps").$type<Array<{
    id: string;
    name: string;
    type: "approval" | "review" | "action" | "notification";
    assignedTo?: string;
    dueInDays?: number;
    required: boolean;
  }>>(),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workflowInstances = pgTable("workflow_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").notNull().references(() => workflows.id),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  entityType: text("entity_type").$type<"supplier" | "contract" | "alert" | "performance">(),
  entityId: varchar("entity_id"),
  status: text("status").$type<"pending" | "in_progress" | "completed" | "cancelled" | "failed">(),
  currentStep: integer("current_step").default(0),
  assignedTo: varchar("assigned_to"),
  dueDate: timestamp("due_date"),
  completedSteps: jsonb("completed_steps"),
  metadata: jsonb("metadata"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// User Management & Access Control
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: text("role").$type<"admin" | "manager" | "analyst" | "viewer">(),
  department: text("department"),
  permissions: jsonb("permissions").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g., "UPDATE_SUPPLIER", "CREATE_ALERT"
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  reason: text("reason"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Predictive Analytics
export const riskPredictions = pgTable("risk_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull().references(() => suppliers.id),
  riskType: text("risk_type").$type<"financial" | "operational" | "geopolitical" | "cyber" | "regulatory" | "reputational">(),
  currentRiskScore: decimal("current_risk_score", { precision: 5, scale: 2 }),
  predictedRiskScore: decimal("predicted_risk_score", { precision: 5, scale: 2 }),
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0-1
  timeHorizon: integer("time_horizon"), // days
  riskFactors: jsonb("risk_factors"),
  recommendedActions: jsonb("recommended_actions"),
  alertThreshold: decimal("alert_threshold", { precision: 5, scale: 2 }),
  modelVersion: varchar("model_version"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scenarios = pgTable("scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  scenarioType: text("scenario_type").$type<"supply_disruption" | "demand_change" | "price_volatility" | "geopolitical" | "regulatory">(),
  impactLevel: text("impact_level").$type<"low" | "medium" | "high" | "critical">(),
  probability: decimal("probability", { precision: 3, scale: 2 }), // 0-1
  affectedSuppliers: jsonb("affected_suppliers").$type<string[]>(),
  impactAnalysis: jsonb("impact_analysis"),
  mitigationStrategies: jsonb("mitigation_strategies"),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Integration & External Data
export const externalDataSources = pgTable("external_data_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").$type<"financial" | "risk" | "market" | "regulatory" | "news" | "weather">(),
  endpoint: text("endpoint"),
  apiKey: text("api_key"),
  refreshFrequency: integer("refresh_frequency"), // hours
  lastSync: timestamp("last_sync"),
  status: text("status").$type<"active" | "inactive" | "error">(),
  configuration: jsonb("configuration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrationLogs = pgTable("integration_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dataSourceId: varchar("data_source_id").references(() => externalDataSources.id),
  status: text("status").$type<"success" | "failed" | "partial">(),
  recordsProcessed: integer("records_processed"),
  errorsCount: integer("errors_count"),
  errorMessages: jsonb("error_messages"),
  executionTime: integer("execution_time"), // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced alerts with categories and escalation
export const enhancedAlerts = pgTable("enhanced_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  category: text("category").$type<"risk" | "performance" | "contract" | "compliance" | "financial" | "operational" | "predictive">(),
  subcategory: text("subcategory"),
  severity: text("severity").$type<"info" | "low" | "medium" | "high" | "critical">(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  source: text("source").$type<"system" | "manual" | "integration" | "ml_model">(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  impact: text("impact").$type<"low" | "medium" | "high">(),
  urgency: text("urgency").$type<"low" | "medium" | "high">(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  dueDate: timestamp("due_date"),
  escalationLevel: integer("escalation_level").default(0),
  relatedAlerts: jsonb("related_alerts").$type<string[]>(),
  actionItems: jsonb("action_items"),
  resolution: text("resolution"),
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  financials: many(supplierFinancials),
  dependencies: many(supplierDependencies),
  metrics: many(performanceMetrics),
  slas: many(slaMetrics),
  costs: many(costAnalysis),
  predictions: many(riskPredictions),
  alerts: many(enhancedAlerts),
}));

export const supplierFinancialsRelations = relations(supplierFinancials, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierFinancials.supplierId],
    references: [suppliers.id],
  }),
}));

export const performanceMetricsRelations = relations(performanceMetrics, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [performanceMetrics.supplierId],
    references: [suppliers.id],
  }),
}));

export const workflowInstancesRelations = relations(workflowInstances, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowInstances.workflowId],
    references: [workflows.id],
  }),
  supplier: one(suppliers, {
    fields: [workflowInstances.supplierId],
    references: [suppliers.id],
  }),
}));

// Schema exports
export const insertSupplierFinancialsSchema = createInsertSchema(supplierFinancials).omit({ id: true, createdAt: true });
export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({ id: true, createdAt: true });
export const insertSlaMetricsSchema = createInsertSchema(slaMetrics).omit({ id: true, createdAt: true });
export const insertCostAnalysisSchema = createInsertSchema(costAnalysis).omit({ id: true, createdAt: true });
export const insertMarketDataSchema = createInsertSchema(marketData).omit({ id: true, createdAt: true, lastUpdated: true });
export const insertWorkflowSchema = createInsertSchema(workflows).omit({ id: true, createdAt: true });
export const insertWorkflowInstanceSchema = createInsertSchema(workflowInstances).omit({ id: true, createdAt: true, completedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRiskPredictionSchema = createInsertSchema(riskPredictions).omit({ id: true, createdAt: true });
export const insertScenarioSchema = createInsertSchema(scenarios).omit({ id: true, createdAt: true });
export const insertEnhancedAlertSchema = createInsertSchema(enhancedAlerts).omit({ id: true, createdAt: true, resolvedAt: true });

// Type exports
export type SupplierFinancials = typeof supplierFinancials.$inferSelect;
export type InsertSupplierFinancials = z.infer<typeof insertSupplierFinancialsSchema>;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetrics = z.infer<typeof insertPerformanceMetricsSchema>;
export type SlaMetrics = typeof slaMetrics.$inferSelect;
export type InsertSlaMetrics = z.infer<typeof insertSlaMetricsSchema>;
export type CostAnalysis = typeof costAnalysis.$inferSelect;
export type InsertCostAnalysis = z.infer<typeof insertCostAnalysisSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type WorkflowInstance = typeof workflowInstances.$inferSelect;
export type InsertWorkflowInstance = z.infer<typeof insertWorkflowInstanceSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RiskPrediction = typeof riskPredictions.$inferSelect;
export type InsertRiskPrediction = z.infer<typeof insertRiskPredictionSchema>;
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type EnhancedAlert = typeof enhancedAlerts.$inferSelect;
export type InsertEnhancedAlert = z.infer<typeof insertEnhancedAlertSchema>;

export const supplierUpdateSchema = insertSupplierSchema.partial();
export type UpdateSupplier = z.infer<typeof supplierUpdateSchema>;
