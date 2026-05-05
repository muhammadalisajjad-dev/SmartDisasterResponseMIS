USE DisasterResponseMIS;
GO

-- ============================================
-- CREATE DATABASE-LEVEL ROLES
-- ============================================
CREATE ROLE db_administrator;
CREATE ROLE db_emergency_operator;
CREATE ROLE db_field_officer;
CREATE ROLE db_warehouse_manager;
CREATE ROLE db_finance_officer;
GO

-- ============================================
-- GRANT PERMISSIONS: Administrator (full access)
-- ============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON emergencies TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON rescue_teams TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON team_assignments TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON warehouses TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON resources TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON allocations TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON hospitals TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON patients TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON transactions TO db_administrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON approval_requests TO db_administrator;
GRANT SELECT ON audit_log TO db_administrator;

-- ============================================
-- GRANT PERMISSIONS: Emergency Operator
-- ============================================
GRANT SELECT ON vw_operator_incidents TO db_emergency_operator;
GRANT SELECT, INSERT, UPDATE ON emergencies TO db_emergency_operator;
GRANT SELECT ON rescue_teams TO db_emergency_operator;
GRANT SELECT ON team_assignments TO db_emergency_operator;

-- ============================================
-- GRANT PERMISSIONS: Field Officer
-- ============================================
GRANT SELECT ON vw_field_officer TO db_field_officer;
GRANT SELECT ON emergencies TO db_field_officer;
GRANT SELECT, INSERT, UPDATE ON team_assignments TO db_field_officer;
GRANT SELECT ON rescue_teams TO db_field_officer;

-- ============================================
-- GRANT PERMISSIONS: Warehouse Manager
-- ============================================
GRANT SELECT ON vw_warehouse_manager TO db_warehouse_manager;
GRANT SELECT, INSERT, UPDATE ON resources TO db_warehouse_manager;
GRANT SELECT ON warehouses TO db_warehouse_manager;
GRANT SELECT, INSERT, UPDATE ON allocations TO db_warehouse_manager;

-- ============================================
-- GRANT PERMISSIONS: Finance Officer
-- ============================================
GRANT SELECT ON vw_finance_officer TO db_finance_officer;
GRANT SELECT, INSERT, UPDATE ON transactions TO db_finance_officer;
GRANT SELECT, INSERT, UPDATE ON approval_requests TO db_finance_officer;

-- ============================================
-- CREATE LOGINS AND USERS (for application connection)
-- ============================================

-- Create server-level logins (run in master context if needed)
/* 
IF SUSER_ID('app_admin') IS NULL
    CREATE LOGIN app_admin WITH PASSWORD = 'Admin@123456', CHECK_POLICY = OFF;
IF SUSER_ID('app_operator') IS NULL
    CREATE LOGIN app_operator WITH PASSWORD = 'Operator@123456', CHECK_POLICY = OFF;
IF SUSER_ID('app_officer') IS NULL
    CREATE LOGIN app_officer WITH PASSWORD = 'Officer@123456', CHECK_POLICY = OFF;
IF SUSER_ID('app_warehouse') IS NULL
    CREATE LOGIN app_warehouse WITH PASSWORD = 'Warehouse@123456', CHECK_POLICY = OFF;
IF SUSER_ID('app_finance') IS NULL
    CREATE LOGIN app_finance WITH PASSWORD = 'Finance@123456', CHECK_POLICY = OFF;
GO 
*/

IF SUSER_ID('app_admin') IS NULL
    CREATE LOGIN app_admin WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
IF SUSER_ID('app_operator') IS NULL
    CREATE LOGIN app_operator WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
IF SUSER_ID('app_officer') IS NULL
    CREATE LOGIN app_officer WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
IF SUSER_ID('app_warehouse') IS NULL
    CREATE LOGIN app_warehouse WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
IF SUSER_ID('app_finance') IS NULL
    CREATE LOGIN app_finance WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;

-- Create database users mapped to logins
IF USER_ID('app_admin') IS NULL
    CREATE USER app_admin FOR LOGIN app_admin;
IF USER_ID('app_operator') IS NULL
    CREATE USER app_operator FOR LOGIN app_operator;
IF USER_ID('app_officer') IS NULL
    CREATE USER app_officer FOR LOGIN app_officer;
IF USER_ID('app_warehouse') IS NULL
    CREATE USER app_warehouse FOR LOGIN app_warehouse;
IF USER_ID('app_finance') IS NULL
    CREATE USER app_finance FOR LOGIN app_finance;
GO

-- Assign users to roles
ALTER ROLE db_administrator ADD MEMBER app_admin;
ALTER ROLE db_emergency_operator ADD MEMBER app_operator;
ALTER ROLE db_field_officer ADD MEMBER app_officer;
ALTER ROLE db_warehouse_manager ADD MEMBER app_warehouse;
ALTER ROLE db_finance_officer ADD MEMBER app_finance;
GO

PRINT 'RBAC implemented successfully.';
GO