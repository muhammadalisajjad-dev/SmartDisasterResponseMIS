USE DisasterResponseMIS;
GO

-- ============================================
-- TABLE 1: users
-- ============================================
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL 
        CHECK (role IN ('admin','emergency_operator','field_officer','warehouse_manager','finance_officer')),
    created_at DATETIME DEFAULT GETDATE()
);

-- ============================================
-- TABLE 2: warehouses
-- ============================================
CREATE TABLE warehouses (
    warehouse_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- ============================================
-- TABLE 3: hospitals
-- ============================================
CREATE TABLE hospitals (
    hospital_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    total_beds INT NOT NULL CHECK (total_beds >= 0),
    available_beds INT NOT NULL CHECK (available_beds >= 0),
    critical_cases INT DEFAULT 0,
    admitted_patients INT DEFAULT 0,
    contact_number VARCHAR(20) NULL
);

-- ============================================
-- TABLE 4: rescue_teams
-- ============================================
CREATE TABLE rescue_teams (
    team_id INT IDENTITY(1,1) PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_type VARCHAR(20) NOT NULL CHECK (team_type IN ('medical','fire','rescue','search')),
    current_location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','assigned','busy','completed')),
    member_count INT DEFAULT 0,
    leader VARCHAR(100) NULL,
    last_updated DATETIME DEFAULT GETDATE()
);

-- ============================================
-- TABLE 5: emergencies
-- ============================================
CREATE TABLE emergencies (
    report_id INT IDENTITY(1,1) PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    disaster_type VARCHAR(20) NOT NULL CHECK (disaster_type IN ('flood','earthquake','fire','cyclone','landslide','other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low','medium','high','critical')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','assigned','in_progress','resolved','closed')),
    description VARCHAR(MAX) NULL,
    reported_by INT NOT NULL,
    reported_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_emergencies_users FOREIGN KEY (reported_by) REFERENCES users(user_id)
);

-- ============================================
-- TABLE 6: resources
-- ============================================
CREATE TABLE resources (
    resource_id INT IDENTITY(1,1) PRIMARY KEY,
    resource_name VARCHAR(100) NOT NULL,
    resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('food','water','medicine','shelter','equipment')),
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    threshold INT DEFAULT 10 CHECK (threshold >= 0),
    unit VARCHAR(20) DEFAULT 'units',
    warehouse_id INT NOT NULL,
    last_updated DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_resources_warehouses FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
);

-- ============================================
-- TABLE 7: team_assignments
-- ============================================
CREATE TABLE team_assignments (
    assignment_id INT IDENTITY(1,1) PRIMARY KEY,
    team_id INT NOT NULL,
    report_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at DATETIME DEFAULT GETDATE(),
    completed_at DATETIME NULL,
    CONSTRAINT FK_assignments_teams FOREIGN KEY (team_id) REFERENCES rescue_teams(team_id),
    CONSTRAINT FK_assignments_emergencies FOREIGN KEY (report_id) REFERENCES emergencies(report_id),
    CONSTRAINT FK_assignments_users FOREIGN KEY (assigned_by) REFERENCES users(user_id)
);

-- ============================================
-- TABLE 8: allocations
-- ============================================
CREATE TABLE allocations (
    allocation_id INT IDENTITY(1,1) PRIMARY KEY,
    resource_id INT NOT NULL,
    report_id INT NOT NULL,
    quantity_allocated INT NOT NULL CHECK (quantity_allocated > 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','dispatched')),
    requested_by INT NOT NULL,
    approved_by INT NULL,
    requested_at DATETIME DEFAULT GETDATE(),
    approved_at DATETIME NULL,
    CONSTRAINT FK_allocations_resources FOREIGN KEY (resource_id) REFERENCES resources(resource_id),
    CONSTRAINT FK_allocations_emergencies FOREIGN KEY (report_id) REFERENCES emergencies(report_id),
    CONSTRAINT FK_allocations_requested FOREIGN KEY (requested_by) REFERENCES users(user_id),
    CONSTRAINT FK_allocations_approved FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- ============================================
-- TABLE 9: patients
-- ============================================
CREATE TABLE patients (
    patient_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    report_id INT NULL,
    hospital_id INT NOT NULL,
    patient_condition VARCHAR(20) DEFAULT 'stable' CHECK (patient_condition IN ('stable','critical','discharged')),
    admitted_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_patients_emergencies FOREIGN KEY (report_id) REFERENCES emergencies(report_id),
    CONSTRAINT FK_patients_hospitals FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);

-- ============================================
-- TABLE 10: transactions
-- ============================================
CREATE TABLE transactions (
    transaction_id INT IDENTITY(1,1) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('donation','expense','procurement')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    description VARCHAR(255),
    category VARCHAR(100) NULL,
    party VARCHAR(100) NULL,
    report_id INT NULL,
    recorded_by INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_transactions_emergencies FOREIGN KEY (report_id) REFERENCES emergencies(report_id),
    CONSTRAINT FK_transactions_users FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

-- ============================================
-- TABLE 11: approval_requests
-- ============================================
CREATE TABLE approval_requests (
    request_id INT IDENTITY(1,1) PRIMARY KEY,
    request_type VARCHAR(30) NOT NULL CHECK (request_type IN ('resource_dispatch','rescue_deployment','financial')),
    reference_id INT NOT NULL,
    title VARCHAR(200) NULL,
    description VARCHAR(500) NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    requested_by INT NOT NULL,
    reviewed_by INT NULL,
    requested_at DATETIME DEFAULT GETDATE(),
    reviewed_at DATETIME NULL,
    remarks VARCHAR(500),
    CONSTRAINT FK_approval_requested FOREIGN KEY (requested_by) REFERENCES users(user_id),
    CONSTRAINT FK_approval_reviewed FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

-- ============================================
-- TABLE 12: audit_log
-- ============================================
CREATE TABLE audit_log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    details VARCHAR(MAX),
    logged_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_audit_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);

PRINT 'All 12 tables created successfully.';
GO