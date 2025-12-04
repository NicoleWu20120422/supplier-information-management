import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "nvarchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "nvarchar", length: 255, nullable: false })
  category: string;

  @Column({ type: "nvarchar", length: 100, nullable: false })
  segmentType: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  annualSpend: number;

  @Column({ type: "decimal", precision: 3, scale: 1, nullable: false })
  riskScore: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })
  performanceScore: number;

  @Column({ type: "int", nullable: false })
  innovationPotential: number;

  @Column({ type: "nvarchar", length: 50, nullable: false })
  supplierComplexity: string;

  @Column({ type: "nvarchar", length: 50, nullable: false })
  marketAvailability: string;

  @Column({ type: "nvarchar", length: 50, nullable: false })
  businessCriticality: string;

  @Column({ type: "nvarchar", length: 50, nullable: false })
  relationshipType: string;

  @Column({ type: "nvarchar", length: "MAX", nullable: true })
  contactInfo: string; // Store as JSON.stringified

  @Column({ type: "nvarchar", length: "MAX", nullable: true })
  tags: string; // Could store CSV or JSON.stringified array

  @Column({ type: "nvarchar", length: "MAX", nullable: true })
  notes: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;
}