USE DisasterResponseMIS;
GO

-- ============================================
-- PERFORMANCE TEST: Views vs Direct Queries
-- ============================================

SET STATISTICS TIME ON;
SET STATISTICS IO ON;

PRINT '========== TEST 1: Admin Dashboard via VIEW ==========';
SELECT * FROM vw_admin_dashboard WHERE incident_status = 'open';

PRINT '========== TEST 1b: Admin Dashboard via DIRECT QUERY ==========';
SELECT 
    e.report_id, e.location, e.disaster_type, e.severity,
    e.status AS incident_status, e.reported_at,
    u.full_name AS reported_by,
    rt.team_name, rt.team_type, rt.status AS team_status
FROM emergencies e
LEFT JOIN users u ON e.reported_by = u.user_id
LEFT JOIN team_assignments ta ON e.report_id = ta.report_id
LEFT JOIN rescue_teams rt ON ta.team_id = rt.team_id
WHERE e.status = 'open';

PRINT '========== TEST 2: Finance via VIEW ==========';
SELECT * FROM vw_finance_officer WHERE type = 'donation';

PRINT '========== TEST 2b: Finance via DIRECT QUERY ==========';
SELECT 
    t.transaction_id, t.type, t.amount, t.description, t.status, t.created_at,
    u.full_name AS recorded_by, e.location AS related_incident
FROM transactions t
LEFT JOIN users u ON t.recorded_by = u.user_id
LEFT JOIN emergencies e ON t.report_id = e.report_id
WHERE t.type = 'donation';

PRINT '========== TEST 3: Indexed vs Non-Indexed Query (Location) ==========';
-- This uses the index idx_emergency_location
SELECT * FROM emergencies WHERE location = 'Lahore';

PRINT '========== TEST 3b: Non-Indexed Query (Table Scan Expected) ==========';
-- If no index on reported_at exists, this will table scan
-- (We do have idx_emergency_reported_at, but testing for a specific date range forces a scan on small data)
SELECT * FROM emergencies WHERE reported_at >= '2024-01-01';

PRINT '========== TEST 4: Composite Index Query ==========';
SELECT * FROM emergencies WHERE location = 'Karachi' AND disaster_type = 'Earthquake';

SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;

PRINT 'Performance tests completed. Check Messages tab for timings.';
GO


SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'
UNION ALL
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS
ORDER BY TABLE_NAME;