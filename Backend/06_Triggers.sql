USE DisasterResponseMIS;
GO

-- ============================================
-- TRIGGER 1: Stock control on allocation (BEFORE INSERT)
-- Prevents negative inventory, auto-deducts quantity
-- ============================================
CREATE TRIGGER trg_stock_control
ON allocations
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @resource_id INT, @quantity_allocated INT, @current_stock INT;
    
    SELECT @resource_id = resource_id, @quantity_allocated = quantity_allocated 
    FROM inserted;
    
    SELECT @current_stock = quantity FROM resources WHERE resource_id = @resource_id;
    
    IF @current_stock - @quantity_allocated < 0
    BEGIN
        RAISERROR('Insufficient stock. Allocation rejected.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    ELSE
    BEGIN
        UPDATE resources
        SET quantity = quantity - @quantity_allocated
        WHERE resource_id = @resource_id;
        
        INSERT INTO allocations (resource_id, report_id, quantity_allocated, status, requested_by, approved_by, requested_at, approved_at)
        SELECT resource_id, report_id, quantity_allocated, status, requested_by, approved_by, GETDATE(), NULL
        FROM inserted;
    END
END
GO

-- ============================================
-- TRIGGER 2: Team status on assignment (AFTER INSERT)
-- ============================================
CREATE TRIGGER trg_team_assigned
ON team_assignments
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE rescue_teams
    SET status = 'assigned'
    WHERE team_id IN (SELECT team_id FROM inserted);
END
GO

-- ============================================
-- TRIGGER 3: Team status on completion (AFTER UPDATE)
-- ============================================
CREATE TRIGGER trg_team_completed
ON team_assignments
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF UPDATE(completed_at)
    BEGIN
        UPDATE rescue_teams
        SET status = 'available'
        FROM rescue_teams rt
        INNER JOIN inserted i ON rt.team_id = i.team_id
        WHERE i.completed_at IS NOT NULL;
    END
END
GO

-- ============================================
-- TRIGGER 4: Hospital bed deduction on patient admission (AFTER INSERT)
-- ============================================
CREATE TRIGGER trg_bed_deduction
ON patients
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @hospital_id INT;
    
    SELECT @hospital_id = hospital_id FROM inserted;
    
    IF (SELECT available_beds FROM hospitals WHERE hospital_id = @hospital_id) <= 0
    BEGIN
        RAISERROR('No available beds in this hospital.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    ELSE
    BEGIN
        UPDATE hospitals
        SET available_beds = available_beds - 1
        WHERE hospital_id = @hospital_id;
    END
END
GO

-- ============================================
-- AUDIT TRIGGERS (AFTER INSERT/UPDATE/DELETE on critical tables)
-- ============================================

-- TRIGGER 5: Audit emergencies INSERT
CREATE TRIGGER trg_audit_emergency_insert
ON emergencies
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO audit_log (user_id, action, table_name, record_id, details)
    SELECT reported_by, 'INSERT', 'emergencies', report_id,
           CONCAT('Location: ', location, ' | Type: ', disaster_type, ' | Severity: ', severity, ' | Status: ', status)
    FROM inserted;
END
GO

-- TRIGGER 6: Audit emergencies UPDATE (status changes)
CREATE TRIGGER trg_audit_emergency_update
ON emergencies
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(status)
    BEGIN
        INSERT INTO audit_log (user_id, action, table_name, record_id, details)
        SELECT i.reported_by, 'UPDATE', 'emergencies', i.report_id,
               CONCAT('Status changed: ', d.status, ' -> ', i.status)
        FROM inserted i
        INNER JOIN deleted d ON i.report_id = d.report_id
        WHERE i.status != d.status;
    END
END
GO

-- TRIGGER 7: Audit allocations INSERT
CREATE TRIGGER trg_audit_allocation_insert
ON allocations
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO audit_log (user_id, action, table_name, record_id, details)
    SELECT requested_by, 'INSERT', 'allocations', allocation_id,
           CONCAT('Resource ID: ', resource_id, ' | Qty: ', quantity_allocated, ' | Status: ', status)
    FROM inserted;
END
GO

-- TRIGGER 8: Audit allocations UPDATE
CREATE TRIGGER trg_audit_allocation_update
ON allocations
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(status)
    BEGIN
        INSERT INTO audit_log (user_id, action, table_name, record_id, details)
        SELECT ISNULL(i.approved_by, i.requested_by), 'UPDATE', 'allocations', i.allocation_id,
               CONCAT('Allocation status: ', d.status, ' -> ', i.status, ' | Resource: ', i.resource_id, ' | Qty: ', i.quantity_allocated)
        FROM inserted i
        INNER JOIN deleted d ON i.allocation_id = d.allocation_id
        WHERE i.status != d.status;
    END
END
GO

-- TRIGGER 9: Audit transactions INSERT
CREATE TRIGGER trg_audit_transaction_insert
ON transactions
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO audit_log (user_id, action, table_name, record_id, details)
    SELECT recorded_by, 'INSERT', 'transactions', transaction_id,
           CONCAT('Type: ', type, ' | Amount: ', amount, ' | Status: ', status)
    FROM inserted;
END
GO

-- TRIGGER 10: Audit team assignments INSERT
CREATE TRIGGER trg_audit_assignment_insert
ON team_assignments
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO audit_log (user_id, action, table_name, record_id, details)
    SELECT assigned_by, 'INSERT', 'team_assignments', assignment_id,
           CONCAT('Team ID: ', team_id, ' assigned to Emergency ID: ', report_id)
    FROM inserted;
END
GO

PRINT 'All triggers created successfully.';
GO