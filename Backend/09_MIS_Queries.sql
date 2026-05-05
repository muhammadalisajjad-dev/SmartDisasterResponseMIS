USE DisasterResponseMIS;
GO

-- ============================================
-- MIS REPORT 1: Incident count by location
-- ============================================
SELECT location, COUNT(*) AS total_incidents
FROM emergencies
GROUP BY location
ORDER BY total_incidents DESC;
GO

-- ============================================
-- MIS REPORT 2: Incident count by disaster type
-- ============================================
SELECT disaster_type, COUNT(*) AS total_incidents
FROM emergencies
GROUP BY disaster_type
ORDER BY total_incidents DESC;
GO

-- ============================================
-- MIS REPORT 3: Severity distribution
-- ============================================
SELECT severity, COUNT(*) AS count
FROM emergencies
GROUP BY severity
ORDER BY 
    CASE severity 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
    END;

-- ============================================
-- MIS REPORT 4: Emergency status breakdown
-- ============================================
SELECT status, COUNT(*) AS count
FROM emergencies
GROUP BY status;
GO

-- ============================================
-- MIS REPORT 5: Resource utilization
-- ============================================
SELECT 
    r.resource_name,
    r.resource_type,
    r.quantity,
    r.threshold,
    w.name AS warehouse,
    CASE 
        WHEN r.quantity <= r.threshold THEN 'RESTOCK NEEDED'
        ELSE 'OK'
    END AS stock_status
FROM resources r
INNER JOIN warehouses w ON r.warehouse_id = w.warehouse_id
ORDER BY 
    CASE WHEN r.quantity <= r.threshold THEN 0 ELSE 1 END,
    r.quantity ASC;
GO

-- ============================================
-- MIS REPORT 6: Financial summary per disaster
-- ============================================
SELECT 
    ISNULL(e.location, 'General') AS location,
    ISNULL(e.disaster_type, 'N/A') AS disaster_type,
    SUM(t.amount) AS total_funds,
    COUNT(t.transaction_id) AS total_transactions
FROM transactions t
LEFT JOIN emergencies e ON t.report_id = e.report_id
GROUP BY e.location, e.disaster_type
ORDER BY total_funds DESC;
GO

-- ============================================
-- MIS REPORT 7: Response time analysis (unresolved)
-- ============================================
SELECT 
    report_id,
    location,
    disaster_type,
    severity,
    status,
    reported_at,
    DATEDIFF(MINUTE, reported_at, GETDATE()) AS minutes_since_report
FROM emergencies
WHERE status != 'resolved'
ORDER BY reported_at ASC;
GO

-- ============================================
-- MIS REPORT 8: Approval request history
-- ============================================
SELECT 
    ar.request_id,
    ar.request_type,
    ar.status,
    ar.requested_at,
    ar.reviewed_at,
    ar.remarks,
    u1.full_name AS requested_by_name,
    ISNULL(u2.full_name, 'Not reviewed') AS reviewed_by_name
FROM approval_requests ar
INNER JOIN users u1 ON ar.requested_by = u1.user_id
LEFT JOIN users u2 ON ar.reviewed_by = u2.user_id
ORDER BY ar.requested_at DESC;
GO

-- ============================================
-- MIS REPORT 9: Audit log (last 50 entries)
-- ============================================
SELECT TOP 50
    al.log_id,
    u.full_name AS performed_by,
    u.role,
    al.action,
    al.table_name,
    al.record_id,
    al.details,
    al.logged_at
FROM audit_log al
LEFT JOIN users u ON al.user_id = u.user_id
ORDER BY al.logged_at DESC;
GO

-- ============================================
-- MIS REPORT 10: Hospital capacity summary
-- ============================================
SELECT 
    h.name AS hospital,
    h.location,
    h.total_beds,
    h.available_beds,
    (h.total_beds - h.available_beds) AS occupied_beds,
    CASE
        WHEN h.available_beds = 0 THEN 'FULL'
        WHEN h.available_beds <= 5 THEN 'NEAR FULL'
        ELSE 'AVAILABLE'
    END AS capacity_status
FROM hospitals h
ORDER BY 
    CASE WHEN h.available_beds = 0 THEN 0 ELSE 1 END,
    h.available_beds ASC;
GO

PRINT 'All MIS queries executed.';
GO