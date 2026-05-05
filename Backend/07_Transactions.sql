USE DisasterResponseMIS;
GO

-- ============================================
-- TRANSACTION 1: Resource Allocation + Audit (ACID DEMO)
-- ============================================
BEGIN TRANSACTION;

INSERT INTO allocations (resource_id, report_id, quantity_allocated, status, requested_by)
VALUES (1, 1, 5, 'pending', 4);

-- Check if allocation was successful
IF @@ERROR != 0
BEGIN
    ROLLBACK TRANSACTION;
    PRINT 'Transaction 1 failed - rolled back.';
    RETURN;
END

INSERT INTO audit_log (user_id, action, table_name, record_id, details)
VALUES (4, 'ALLOCATE', 'allocations', SCOPE_IDENTITY(), 'Resource allocated to emergency');

COMMIT TRANSACTION;
PRINT 'Transaction 1 committed successfully.';
GO

-- ============================================
-- TRANSACTION 2: Rollback Demo (insufficient stock)
-- ============================================
BEGIN TRANSACTION;

-- This should fail if stock is insufficient
BEGIN TRY
    INSERT INTO allocations (resource_id, report_id, quantity_allocated, status, requested_by)
    VALUES (1, 1, 99999, 'pending', 4);
    
    COMMIT TRANSACTION;
    PRINT 'Transaction 2 committed.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Transaction 2 rolled back - ' + ERROR_MESSAGE();
END CATCH
GO

-- ============================================
-- TRANSACTION 3: Financial + Approval Workflow
-- ============================================
BEGIN TRANSACTION;

DECLARE @new_tran_id INT;

INSERT INTO transactions (type, amount, description, report_id, recorded_by, status)
VALUES ('expense', 15000.00, 'Emergency supplies procurement', 1, 5, 'pending');

SET @new_tran_id = SCOPE_IDENTITY();

INSERT INTO approval_requests (request_type, reference_id, status, requested_by)
VALUES ('financial', @new_tran_id, 'pending', 5);

COMMIT TRANSACTION;
PRINT 'Transaction 3 committed - financial and approval created.';
GO

-- ============================================
-- TRANSACTION 4: Concurrency Control (SELECT FOR UPDATE equivalent)
-- In SQL Server: use WITH (UPDLOCK, ROWLOCK) hint
-- ============================================
BEGIN TRANSACTION;

SELECT quantity 
FROM resources WITH (UPDLOCK, ROWLOCK)
WHERE resource_id = 1;

-- Simulate allocation after lock
UPDATE resources SET quantity = quantity - 3 WHERE resource_id = 1;

INSERT INTO audit_log (user_id, action, table_name, record_id, details)
VALUES (4, 'CONCURRENT_ALLOCATE', 'resources', 1, 'Concurrency-controlled allocation');

COMMIT TRANSACTION;
PRINT 'Transaction 4 committed with row-level locking.';
GO

-- ============================================
-- TRANSACTION 5: Isolation Level Demo
-- ============================================
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

SELECT quantity FROM resources WHERE resource_id = 1;

-- Hold for consistency
WAITFOR DELAY '00:00:02';

COMMIT TRANSACTION;
PRINT 'Transaction 5 completed under SERIALIZABLE isolation.';
GO

PRINT 'All transaction demos completed successfully.';
GO
