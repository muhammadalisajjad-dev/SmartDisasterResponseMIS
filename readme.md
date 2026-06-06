DATABASE CONNECTION
===================
Server: localhost\SQLEXPRESS (configure for your environment)
Database: DisasterResponseMIS
Authentication: Windows Authentication (Integrated Security)

API ENDPOINTS
=============
Base URL: http://localhost:4000

GET  /api/reports       - All emergency reports
POST /api/reports       - Create new report
GET  /api/teams         - All rescue teams
POST /api/teams/:id/assign - Assign team to report
GET  /api/resources     - All resources
GET  /api/hospitals     - Hospital capacity
GET  /api/finance       - All transactions
POST /api/finance       - Create transaction
GET  /api/approvals     - All approval requests
PUT  /api/approvals/:id - Approve/reject
GET  /api/audit         - Audit logs
GET  /api/users         - All users
POST /api/auth/login    - Login

LOGIN CREDENTIALS
=================
Email: admin@disaster.gov    Password: hashed_admin123
Email: sara@disaster.gov     Password: hashed_operator123
Email: ali@disaster.gov      Password: hashed_officer123
Email: zara@disaster.gov     Password: hashed_warehouse123
Email: omar@disaster.gov     Password: hashed_finance123

FRONTEND
========
.env file must contain:
VITE_MOCK_MODE=false
VITE_API_URL=http://localhost:4000

Run: cd web > npm install > npm run dev
API must be running: cd DisasterAPI > dotnet run
