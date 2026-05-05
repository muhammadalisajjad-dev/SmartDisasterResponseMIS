USE DisasterResponseMIS;
GO

-- ============================================
-- SINGLE COLUMN INDEXES
-- ============================================

-- Emergency table indexes (high-frequency query columns)
CREATE INDEX idx_emergency_location ON emergencies(location);
CREATE INDEX idx_emergency_disaster_type ON emergencies(disaster_type);
CREATE INDEX idx_emergency_severity ON emergencies(severity);
CREATE INDEX idx_emergency_status ON emergencies(status);
CREATE INDEX idx_emergency_reported_at ON emergencies(reported_at);

-- Transaction table indexes (financial reporting)
CREATE INDEX idx_transaction_type ON transactions(type);
CREATE INDEX idx_transaction_status ON transactions(status);
CREATE INDEX idx_transaction_created_at ON transactions(created_at);

-- Resource table indexes (warehouse queries)
CREATE INDEX idx_resource_type ON resources(resource_type);
CREATE INDEX idx_resource_warehouse ON resources(warehouse_id);

-- Assignment indexes (team tracking)
CREATE INDEX idx_assignment_team ON team_assignments(team_id);
CREATE INDEX idx_assignment_report ON team_assignments(report_id);

-- Allocation indexes
CREATE INDEX idx_allocation_status ON allocations(status);

-- ============================================
-- COMPOSITE INDEXES
-- ============================================

-- Common combined queries for MIS dashboards
CREATE INDEX idx_emergency_loc_type ON emergencies(location, disaster_type);
CREATE INDEX idx_emergency_type_severity ON emergencies(disaster_type, severity);
CREATE INDEX idx_resource_type_warehouse ON resources(resource_type, warehouse_id);
CREATE INDEX idx_transaction_type_status ON transactions(type, status);

PRINT 'All indexes created successfully.';
GO