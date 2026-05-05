USE DisasterResponseMIS;
GO

-- ============================================
-- INSERT SAMPLE USERS
-- ============================================
---- INSERT INTO users (username, email, password_hash, full_name, role) VALUES
----('admin1',     'admin@disaster.gov',     HASHBYTES('SHA2_256', 'admin123'),     'Admin Khan',    'admin'),
----('operator1',  'sara@disaster.gov',      HASHBYTES('SHA2_256', 'operator123'),  'Sara Ops',      'emergency_operator'),
----('officer1',   'ali@disaster.gov',       HASHBYTES('SHA2_256', 'officer123'),   'Ali Field',     'field_officer'),
----('warehouse1', 'zara@disaster.gov',      HASHBYTES('SHA2_256', 'warehouse123'), 'Zara Store',    'warehouse_manager'),
----('finance1',   'omar@disaster.gov',      HASHBYTES('SHA2_256', 'finance123'),   'Omar Finance',  'finance_officer');

USE DisasterResponseMIS;
GO

UPDATE users SET password_hash = HASHBYTES('SHA2_256', 'password') WHERE user_id = 1;
UPDATE users SET password_hash = HASHBYTES('SHA2_256', 'password') WHERE user_id = 2;
UPDATE users SET password_hash = HASHBYTES('SHA2_256', 'password') WHERE user_id = 3;
UPDATE users SET password_hash = HASHBYTES('SHA2_256', 'password') WHERE user_id = 4;
UPDATE users SET password_hash = HASHBYTES('SHA2_256', 'password') WHERE user_id = 5;

-- ============================================
-- INSERT WAREHOUSES
-- ============================================
INSERT INTO warehouses (name, location) VALUES
('Karachi Central', 'Karachi'),
('Lahore Depot', 'Lahore'),
('Islamabad Store', 'Islamabad');

-- ============================================
-- INSERT HOSPITALS
-- ============================================
INSERT INTO hospitals (name, location, total_beds, available_beds, critical_cases, admitted_patients, contact_number) VALUES
('Jinnah Hospital', 'Karachi', 500, 45, 23, 455, '021-9999101'),
('PIMS Hospital', 'Islamabad', 350, 120, 12, 230, '051-9106441'),
('Mayo Hospital', 'Lahore', 600, 200, 8, 400, '042-9923401');

-- ============================================
-- INSERT RESCUE TEAMS
-- ============================================
INSERT INTO rescue_teams (team_name, team_type, current_location, status, member_count, leader) VALUES
('Alpha Medical', 'medical', 'Karachi', 'busy', 8, 'Dr. Ahmed'),
('Bravo Rescue', 'rescue', 'Islamabad', 'assigned', 12, 'Capt. Hassan'),
('Charlie Fire', 'fire', 'Hyderabad', 'busy', 10, 'Chief Malik'),
('Delta Search', 'search', 'Lahore', 'available', 6, 'Sgt. Raza'),
('Echo Medical', 'medical', 'Peshawar', 'available', 7, 'Dr. Fatima');

-- ============================================
-- INSERT RESOURCES
-- ============================================
INSERT INTO resources (resource_name, resource_type, quantity, threshold, unit, warehouse_id) VALUES
('Rice Bags (50kg)', 'food', 250, 100, 'bags', 1),
('Drinking Water (20L)', 'water', 80, 100, 'gallons', 1),
('First Aid Kits', 'medicine', 45, 50, 'kits', 2),
('Family Tents', 'shelter', 120, 50, 'units', 1),
('Antibiotics (Pack)', 'medicine', 300, 100, 'packs', 3),
('Emergency Rations', 'food', 40, 60, 'boxes', 2),
('Generators', 'equipment', 15, 5, 'units', 3),
('Blankets', 'shelter', 500, 200, 'pieces', 2);

-- ============================================
-- INSERT EMERGENCIES
-- ============================================
INSERT INTO emergencies (location, disaster_type, severity, status, description, reported_by) VALUES
('Karachi, Sindh', 'flood', 'critical', 'in_progress', 'Severe flooding in coastal areas, thousands displaced.', 1),
('Islamabad, Punjab', 'earthquake', 'high', 'assigned', '5.8 magnitude quake, structural damage reported.', 2),
('Lahore, Punjab', 'fire', 'high', 'open', 'Industrial fire spreading rapidly, evacuation needed.', 2),
('Peshawar, KPK', 'flood', 'medium', 'open', 'River overflow affecting nearby villages.', 1),
('Quetta, Balochistan', 'earthquake', 'low', 'resolved', 'Minor tremors, no structural damage confirmed.', 2),
('Multan, Punjab', 'fire', 'critical', 'open', 'Hospital fire, immediate patient evacuation required.', 2),
('Hyderabad, Sindh', 'cyclone', 'high', 'in_progress', 'Category 2 cyclone approaching coastline.', 1);

-- ============================================
-- INSERT TEAM ASSIGNMENTS
-- ============================================
INSERT INTO team_assignments (team_id, report_id, assigned_by) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 7, 1);

-- ============================================
-- INSERT ALLOCATIONS
-- ============================================
INSERT INTO allocations (resource_id, report_id, quantity_allocated, status, requested_by) VALUES
(1, 1, 50, 'pending', 3),
(3, 2, 20, 'pending', 3);

-- ============================================
-- INSERT PATIENTS
-- ============================================
INSERT INTO patients (full_name, report_id, hospital_id, patient_condition) VALUES
('Ahmed Raza', 1, 1, 'stable'),
('Sara Bibi', 2, 2, 'critical'),
('Usman Ali', 2, 2, 'stable');

-- ============================================
-- INSERT TRANSACTIONS
-- ============================================
INSERT INTO transactions (type, amount, description, category, party, report_id, recorded_by, status) VALUES
('donation', 5000000, 'Corporate donation – flood relief', 'Flood Relief', 'Engro Corporation', 1, 5, 'approved'),
('donation', 500000, 'Individual donation', 'General', 'Anonymous Donor', NULL, 5, 'approved'),
('expense', 250000, 'Fuel for rescue vehicles', 'Operations', 'PSO Fuel Depot', 2, 5, 'approved'),
('procurement', 1200000, 'Medical supplies procurement', 'Medical', 'MedPak Supplies', 1, 5, 'pending'),
('expense', 75000, 'Emergency food ration distribution', 'Food & Water', 'Distribution Team', 1, 5, 'approved');

-- ============================================
-- INSERT APPROVAL REQUESTS
-- ============================================
INSERT INTO approval_requests (request_type, reference_id, title, description, status, requested_by) VALUES
('resource_dispatch', 1, 'Dispatch 50 Food Bags to Karachi', 'Request to dispatch 50 rice bags from Karachi Central to flood zone.', 'pending', 3),
('rescue_deployment', 4, 'Deploy Delta Team to Lahore Fire', 'Deploy Delta Search Team to the Lahore industrial fire.', 'pending', 2),
('financial', 4, 'Approve Medical Supplies – PKR 1.2M', 'Procurement of medical supplies for earthquake relief.', 'pending', 5);

PRINT 'Sample data inserted successfully.';
GO
-- Show that passwords are hashed, not plaintext
SELECT user_id, username, email, password_hash FROM users;