import type {
  User, EmergencyReport, RescueTeam, Resource,
  Hospital, FinancialTransaction, ApprovalRequest, AuditLog,
} from '../types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin Khan',    email: 'admin@disaster.gov',     role: 'admin' },
  { id: 2, name: 'Sara Ops',      email: 'sara@disaster.gov',      role: 'emergency_operator' },
  { id: 3, name: 'Ali Field',     email: 'ali@disaster.gov',       role: 'field_officer' },
  { id: 4, name: 'Zara Store',    email: 'zara@disaster.gov',      role: 'warehouse_manager' },
  { id: 5, name: 'Omar Finance',  email: 'omar@disaster.gov',      role: 'finance_officer' },
];

export const MOCK_REPORTS: EmergencyReport[] = [
  { id: 1, location: 'Karachi, Sindh',       disasterType: 'flood',       severity: 'critical', reportedAt: '2026-05-01T08:23:00', status: 'in_progress', reportedBy: 'Citizen App',        description: 'Severe flooding in coastal areas, thousands displaced.',           teamAssigned: 1 },
  { id: 2, location: 'Islamabad, Punjab',    disasterType: 'earthquake',  severity: 'high',     reportedAt: '2026-05-01T10:15:00', status: 'assigned',    reportedBy: 'Helpline 1122',      description: '5.8 magnitude quake, structural damage reported.',                 teamAssigned: 2 },
  { id: 3, location: 'Lahore, Punjab',       disasterType: 'fire',        severity: 'high',     reportedAt: '2026-05-02T06:45:00', status: 'open',        reportedBy: 'Monitoring System',  description: 'Industrial fire spreading rapidly, evacuation needed.' },
  { id: 4, location: 'Peshawar, KPK',        disasterType: 'flood',       severity: 'medium',   reportedAt: '2026-05-02T09:00:00', status: 'open',        reportedBy: 'Citizen App',        description: 'River overflow affecting nearby villages.' },
  { id: 5, location: 'Quetta, Balochistan',  disasterType: 'earthquake',  severity: 'low',      reportedAt: '2026-05-02T11:30:00', status: 'resolved',    reportedBy: 'Monitoring System',  description: 'Minor tremors, no structural damage confirmed.' },
  { id: 6, location: 'Multan, Punjab',       disasterType: 'fire',        severity: 'critical', reportedAt: '2026-05-02T14:00:00', status: 'open',        reportedBy: 'Helpline 1122',      description: 'Hospital fire, immediate patient evacuation required.' },
  { id: 7, location: 'Hyderabad, Sindh',     disasterType: 'cyclone',     severity: 'high',     reportedAt: '2026-05-02T15:20:00', status: 'in_progress', reportedBy: 'Monitoring System',  description: 'Category 2 cyclone approaching coastline.',                        teamAssigned: 3 },
];

export const MOCK_TEAMS: RescueTeam[] = [
  { id: 1, name: 'Alpha Medical',   type: 'medical',  location: 'Karachi',    status: 'busy',      memberCount: 8,  leader: 'Dr. Ahmed',    assignedReportId: 1, lastUpdated: '2026-05-01T09:00:00' },
  { id: 2, name: 'Bravo Rescue',    type: 'rescue',   location: 'Islamabad',  status: 'assigned',  memberCount: 12, leader: 'Capt. Hassan', assignedReportId: 2, lastUpdated: '2026-05-01T11:00:00' },
  { id: 3, name: 'Charlie Fire',    type: 'fire',     location: 'Hyderabad',  status: 'busy',      memberCount: 10, leader: 'Chief Malik',  assignedReportId: 7, lastUpdated: '2026-05-02T16:00:00' },
  { id: 4, name: 'Delta Search',    type: 'search',   location: 'Lahore',     status: 'available', memberCount: 6,  leader: 'Sgt. Raza',    lastUpdated: '2026-05-02T08:00:00' },
  { id: 5, name: 'Echo Medical',    type: 'medical',  location: 'Peshawar',   status: 'available', memberCount: 7,  leader: 'Dr. Fatima',   lastUpdated: '2026-05-01T18:00:00' },
  { id: 6, name: 'Foxtrot Rescue',  type: 'rescue',   location: 'Quetta',     status: 'completed', memberCount: 9,  leader: 'Maj. Tariq',   lastUpdated: '2026-05-02T12:00:00' },
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 1, name: 'Rice Bags (50kg)',     type: 'food',      warehouseId: 1, warehouseName: 'Karachi Central',  quantity: 250, unit: 'bags',    threshold: 100, lastUpdated: '2026-05-02T10:00:00' },
  { id: 2, name: 'Drinking Water (20L)', type: 'water',     warehouseId: 1, warehouseName: 'Karachi Central',  quantity: 80,  unit: 'gallons', threshold: 100, lastUpdated: '2026-05-02T10:00:00' },
  { id: 3, name: 'First Aid Kits',       type: 'medicine',  warehouseId: 2, warehouseName: 'Lahore Depot',     quantity: 45,  unit: 'kits',    threshold: 50,  lastUpdated: '2026-05-01T14:00:00' },
  { id: 4, name: 'Family Tents',         type: 'shelter',   warehouseId: 1, warehouseName: 'Karachi Central',  quantity: 120, unit: 'units',   threshold: 50,  lastUpdated: '2026-05-02T09:00:00' },
  { id: 5, name: 'Antibiotics (Pack)',   type: 'medicine',  warehouseId: 3, warehouseName: 'Islamabad Store',  quantity: 300, unit: 'packs',   threshold: 100, lastUpdated: '2026-05-02T11:00:00' },
  { id: 6, name: 'Emergency Rations',   type: 'food',      warehouseId: 2, warehouseName: 'Lahore Depot',     quantity: 40,  unit: 'boxes',   threshold: 60,  lastUpdated: '2026-05-02T08:00:00' },
  { id: 7, name: 'Generators',          type: 'equipment', warehouseId: 3, warehouseName: 'Islamabad Store',  quantity: 15,  unit: 'units',   threshold: 5,   lastUpdated: '2026-05-01T16:00:00' },
  { id: 8, name: 'Blankets',            type: 'shelter',   warehouseId: 2, warehouseName: 'Lahore Depot',     quantity: 500, unit: 'pieces',  threshold: 200, lastUpdated: '2026-05-02T07:00:00' },
];

export const MOCK_HOSPITALS: Hospital[] = [
  { id: 1, name: 'Jinnah Hospital',       location: 'Karachi',    totalBeds: 500, availableBeds: 45,  criticalCases: 23, admittedPatients: 455, contactNumber: '021-9999101' },
  { id: 2, name: 'PIMS Hospital',         location: 'Islamabad',  totalBeds: 350, availableBeds: 120, criticalCases: 12, admittedPatients: 230, contactNumber: '051-9106441' },
  { id: 3, name: 'Mayo Hospital',         location: 'Lahore',     totalBeds: 600, availableBeds: 200, criticalCases: 8,  admittedPatients: 400, contactNumber: '042-9923401' },
  { id: 4, name: 'Hayatabad Medical',     location: 'Peshawar',   totalBeds: 250, availableBeds: 80,  criticalCases: 5,  admittedPatients: 170, contactNumber: '091-9216420' },
  { id: 5, name: 'Civil Hospital Quetta', location: 'Quetta',     totalBeds: 300, availableBeds: 10,  criticalCases: 18, admittedPatients: 290, contactNumber: '081-9201071' },
];

export const MOCK_FINANCE: FinancialTransaction[] = [
  { id: 1, type: 'donation',     amount: 5000000, description: 'Corporate donation – flood relief',      category: 'Flood Relief',  date: '2026-05-01', party: 'Engro Corporation',   status: 'approved', approvedBy: 'Admin Khan' },
  { id: 2, type: 'donation',     amount:  500000, description: 'Individual donation',                    category: 'General',       date: '2026-05-01', party: 'Anonymous Donor',     status: 'approved', approvedBy: 'Admin Khan' },
  { id: 3, type: 'expense',      amount:  250000, description: 'Fuel for rescue vehicles',               category: 'Operations',    date: '2026-05-02', party: 'PSO Fuel Depot',      status: 'approved', approvedBy: 'Admin Khan' },
  { id: 4, type: 'procurement',  amount: 1200000, description: 'Medical supplies procurement',           category: 'Medical',       date: '2026-05-02', party: 'MedPak Supplies',     status: 'pending' },
  { id: 5, type: 'expense',      amount:   75000, description: 'Emergency food ration distribution',    category: 'Food & Water',  date: '2026-05-02', party: 'Distribution Team',   status: 'approved', approvedBy: 'Admin Khan' },
  { id: 6, type: 'donation',     amount: 2000000, description: 'Government disaster relief fund',       category: 'Government',    date: '2026-04-30', party: 'NDMA',                status: 'approved', approvedBy: 'Admin Khan' },
  { id: 7, type: 'expense',      amount:  180000, description: 'Helicopter fuel – aerial assessment',   category: 'Operations',    date: '2026-05-02', party: 'Aviation Services',   status: 'pending' },
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  { id: 1, type: 'resource_dispatch',  title: 'Dispatch 50 Food Bags to Karachi',       description: 'Request to dispatch 50 rice bags from Karachi Central to flood zone.',      requestedBy: 'Ali Field',     requestedAt: '2026-05-02T08:00:00', status: 'pending' },
  { id: 2, type: 'rescue_deployment',  title: 'Deploy Delta Team to Lahore Fire',       description: 'Deploy Delta Search Team to the Lahore industrial fire.',                   requestedBy: 'Sara Ops',      requestedAt: '2026-05-02T06:50:00', status: 'pending' },
  { id: 3, type: 'financial',          title: 'Approve Medical Supplies – PKR 1.2M',    description: 'Procurement of medical supplies for earthquake relief.',                    requestedBy: 'Omar Finance',  requestedAt: '2026-05-02T09:30:00', status: 'pending' },
  { id: 4, type: 'resource_dispatch',  title: 'Allocate 20 Tents to Peshawar',          description: 'Dispatch family tents for flood victims in Peshawar.',                      requestedBy: 'Zara Store',    requestedAt: '2026-05-01T14:00:00', status: 'approved', reviewedBy: 'Admin Khan', reviewedAt: '2026-05-01T15:30:00' },
  { id: 5, type: 'financial',          title: 'Expense: Rescue Vehicle Fuel',           description: 'PKR 250,000 fuel expense for active rescue operations.',                   requestedBy: 'Omar Finance',  requestedAt: '2026-05-02T07:00:00', status: 'approved', reviewedBy: 'Admin Khan', reviewedAt: '2026-05-02T08:00:00' },
  { id: 6, type: 'rescue_deployment',  title: 'Deploy Echo Medical to Hyderabad',       description: 'Deploy Echo Medical Unit to cyclone-affected coastal areas.',               requestedBy: 'Sara Ops',      requestedAt: '2026-05-02T15:25:00', status: 'rejected', reviewedBy: 'Admin Khan', reviewedAt: '2026-05-02T15:50:00' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 1, userId: 2, userName: 'Sara Ops',     role: 'emergency_operator', action: 'CREATE',  tableName: 'emergency_reports',  recordId: 7, timestamp: '2026-05-02T15:20:00', details: 'New emergency report: cyclone in Hyderabad' },
  { id: 2, userId: 1, userName: 'Admin Khan',   role: 'admin',              action: 'APPROVE', tableName: 'approval_requests',  recordId: 5, timestamp: '2026-05-02T08:00:00', details: 'Approved fuel expense PKR 250,000' },
  { id: 3, userId: 4, userName: 'Zara Store',   role: 'warehouse_manager',  action: 'UPDATE',  tableName: 'resources',          recordId: 2, timestamp: '2026-05-02T10:00:00', details: 'Updated water stock after dispatch: 80 gallons remaining' },
  { id: 4, userId: 3, userName: 'Ali Field',    role: 'field_officer',      action: 'CREATE',  tableName: 'approval_requests',  recordId: 1, timestamp: '2026-05-02T08:00:00', details: 'Resource dispatch request: 50 rice bags to Karachi flood zone' },
  { id: 5, userId: 1, userName: 'Admin Khan',   role: 'admin',              action: 'CREATE',  tableName: 'users',              recordId: 5, timestamp: '2026-05-01T09:00:00', details: 'New user created: Omar Finance (Finance Officer)' },
  { id: 6, userId: 5, userName: 'Omar Finance', role: 'finance_officer',    action: 'CREATE',  tableName: 'transactions',       recordId: 4, timestamp: '2026-05-02T09:30:00', details: 'Recorded procurement: MedPak Supplies PKR 1.2M' },
  { id: 7, userId: 2, userName: 'Sara Ops',     role: 'emergency_operator', action: 'UPDATE',  tableName: 'rescue_teams',       recordId: 3, timestamp: '2026-05-02T16:00:00', details: 'Charlie Fire assigned to Hyderabad cyclone (Report #7)' },
  { id: 8, userId: 1, userName: 'Admin Khan',   role: 'admin',              action: 'REJECT',  tableName: 'approval_requests',  recordId: 6, timestamp: '2026-05-02T15:50:00', details: 'Rejected Echo Medical deployment — team needed locally' },
  { id: 9, userId: 2, userName: 'Sara Ops',     role: 'emergency_operator', action: 'LOGIN',   tableName: 'users',              recordId: 2, timestamp: '2026-05-02T06:00:00', details: 'User login from 192.168.1.45' },
];
