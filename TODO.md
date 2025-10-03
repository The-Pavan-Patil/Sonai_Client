# TODO: Add Site Information and Functionality

## Backend Changes
- [x] Create Site model (Server/models/Site.js) with fields: siteId, name, address, etc.
- [x] Update Labour model (Server/models/Labour.js) to add site reference
- [x] Update attendance controller (Server/controllers/attendance.controller.js) to support filtering by site
- [x] Update attendance routes (Server/routes/attendance.routes.js) to include site filter endpoint
- [x] Add API endpoints for fetching sites (if not already present)

## Frontend Changes
- [x] Update Add Labour modal to include site selection field
- [x] Update Labour management table to display site name
- [x] Update Attendance tab to include filter by site

## Data and Testing
- [x] Update seed data (Server/seed.js) to include sample sites
- [ ] Test site association with labours
- [ ] Test attendance filtering by site
- [ ] Verify frontend-backend integration
