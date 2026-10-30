# CarePoint — Hospital Management System

A responsive React + Vite hospital management dashboard with role-based demo access and browser persistence.

## Run in VS Code
1. Extract this folder.
2. Open `hospital-management-system` in VS Code.
3. Open Terminal → New Terminal.
4. Run `npm install`
5. Run `npm run dev`
6. Open the local URL printed by Vite (usually http://localhost:5173).

## Demo accounts
All demo accounts use password: `carepoint123`

| Role | Email |
|---|---|
| Admin | admin@carepoint.in |
| Doctor | doctor@carepoint.in |
| Receptionist | reception@carepoint.in |
| Patient | patient@carepoint.in |

You can also use the quick role buttons on the login screen.

## Included
- Role-aware login and navigation for Admin, Doctor, Receptionist and Patient
- Dashboard overview, patient records, doctors, appointments and billing
- Add, edit and delete records (where the role permits)
- Patients can book appointments for themselves, choose an available doctor, select date/time, and cancel future appointments
- Search and status filters
- Persistent browser storage using `localStorage`
- Responsive desktop/tablet/mobile layout
- Seeded demo data and reset-to-demo-data action

## Important deployment/security note
This is a frontend demonstration project. `localStorage` is device/browser-specific and is **not** a secure shared hospital database. The demo login is not production authentication. Do not enter real patient data. A real deployment must add a secure backend/API, database, server-side authorization, encrypted transport/storage, audit logs, backups, and applicable healthcare privacy compliance.
