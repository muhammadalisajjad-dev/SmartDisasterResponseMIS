export type UserRole =
  | 'admin'
  | 'emergency_operator'
  | 'field_officer'
  | 'warehouse_manager'
  | 'finance_officer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type DisasterType = 'flood' | 'earthquake' | 'fire' | 'cyclone' | 'landslide' | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export interface EmergencyReport {
  id: number;
  location: string;
  disasterType: DisasterType;
  severity: Severity;
  reportedAt: string;
  status: ReportStatus;
  reportedBy: string;
  description: string;
  teamAssigned?: number;
}

export type TeamType = 'medical' | 'fire' | 'rescue' | 'search';
export type TeamStatus = 'available' | 'assigned' | 'busy' | 'completed';

export interface RescueTeam {
  id: number;
  name: string;
  type: TeamType;
  location: string;
  status: TeamStatus;
  memberCount: number;
  leader: string;
  assignedReportId?: number;
  lastUpdated: string;
}

export type ResourceType = 'food' | 'water' | 'medicine' | 'shelter' | 'equipment';

export interface Resource {
  id: number;
  name: string;
  type: ResourceType;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  unit: string;
  threshold: number;
  lastUpdated: string;
}

export interface Hospital {
  id: number;
  name: string;
  location: string;
  totalBeds: number;
  availableBeds: number;
  criticalCases: number;
  admittedPatients: number;
  contactNumber: string;
}

export type TransactionType = 'donation' | 'expense' | 'procurement';

export interface FinancialTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  party: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

export type ApprovalType = 'resource_dispatch' | 'rescue_deployment' | 'financial';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: number;
  type: ApprovalType;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  role: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'APPROVE' | 'REJECT';
  tableName: string;
  recordId: number;
  timestamp: string;
  details: string;
}
