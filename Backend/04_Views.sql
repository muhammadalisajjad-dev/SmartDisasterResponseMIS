USE DisasterResponseMIS;
GO

-- ============================================
-- VIEW 1: Admin Dashboard
-- ============================================
CREATE VIEW vw_admin_dashboard AS
SELECT 
    e.report_id,
    e.location,
    e.disaster_type,
    e.severity,
    e.status AS incident_status,
    e.description,
    e.reported_at,
    u.full_name AS reported_by,
    rt.team_name,
    rt.team_type,
    rt.status AS team_status
FROM emergencies e
LEFT JOIN users u ON e.reported_by = u.user_id
LEFT JOIN team_assignments ta ON e.report_id = ta.report_id
LEFT JOIN rescue_teams rt ON ta.team_id = rt.team_id;
GO

-- ============================================
-- VIEW 2: Emergency Operator
-- ============================================
CREATE VIEW vw_operator_incidents AS
SELECT 
    e.report_id,
    e.location,
    e.disaster_type,
    e.severity,
    e.status,
    e.description,
    e.reported_at,
    u.full_name AS reported_by
FROM emergencies e
LEFT JOIN users u ON e.reported_by = u.user_id;
GO

-- ============================================
-- VIEW 3: Field Officer
-- ============================================
CREATE VIEW vw_field_officer AS
SELECT 
    ta.assignment_id,
    rt.team_name,
    rt.team_type,
    rt.current_location,
    rt.status AS team_status,
    rt.member_count,
    rt.leader,
    e.location AS incident_location,
    e.disaster_type,
    e.severity,
    ta.assigned_at,
    ta.completed_at
FROM team_assignments ta
INNER JOIN rescue_teams rt ON ta.team_id = rt.team_id
INNER JOIN emergencies e ON ta.report_id = e.report_id;
GO

-- ============================================
-- VIEW 4: Warehouse Manager
-- ============================================
CREATE VIEW vw_warehouse_manager AS
SELECT 
    r.resource_id,
    r.resource_name,
    r.resource_type,
    r.quantity,
    r.unit,
    r.threshold,
    r.last_updated,
    w.name AS warehouse_name,
    w.location AS warehouse_location,
    CASE 
        WHEN r.quantity <= r.threshold THEN 'LOW STOCK'
        ELSE 'OK'
    END AS stock_alert
FROM resources r
INNER JOIN warehouses w ON r.warehouse_id = w.warehouse_id;
GO

-- ============================================
-- VIEW 5: Finance Officer
-- ============================================
CREATE VIEW vw_finance_officer AS
SELECT 
    t.transaction_id,
    t.type,
    t.amount,
    t.description,
    t.category,
    t.party,
    t.status,
    t.created_at,
    u.full_name AS recorded_by,
    e.location AS related_incident
FROM transactions t
LEFT JOIN users u ON t.recorded_by = u.user_id
LEFT JOIN emergencies e ON t.report_id = e.report_id;
GO

-- ============================================
-- VIEW 6: Hospital Capacity
-- ============================================
CREATE VIEW vw_hospital_capacity AS
SELECT 
    h.hospital_id,
    h.name AS hospital_name,
    h.location,
    h.total_beds,
    h.available_beds,
    h.critical_cases,
    h.admitted_patients,
    h.contact_number,
    CASE
        WHEN h.available_beds = 0 THEN 'FULL'
        WHEN h.available_beds <= 5 THEN 'NEAR FULL'
        ELSE 'AVAILABLE'
    END AS capacity_status
FROM hospitals h;
GO

-- ============================================
-- VIEW 7: MIS Report
-- ============================================
CREATE VIEW vw_mis_report AS
SELECT 
    e.location,
    e.disaster_type,
    e.severity,
    COUNT(e.report_id) AS total_incidents,
    SUM(CASE WHEN e.status = 'resolved' THEN 1 ELSE 0 END) AS resolved,
    SUM(CASE WHEN e.status = 'open' THEN 1 ELSE 0 END) AS open_count,
    SUM(CASE WHEN e.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_count
FROM emergencies e
GROUP BY e.location, e.disaster_type, e.severity;
GO

PRINT 'All 7 views created successfully.';
GO