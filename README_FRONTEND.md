# Bank Sampah Frontend Structure

This project is structured to support two distinct roles: **RW** and **Kelurahan**.

## Folder Structure

- `src/app/rw/`: Contains all pages for the RW role.
  - `dashboard/`: Dashboard with summary and charts.
  - `transactions/`: List of transactions.
  - `online-requests/`: Management of pickup requests.
  - `price-list/`: Management of waste prices for Warga.
  - `schedules/`: Management of collection schedules.
- `src/app/kelurahan/`: Contains all pages for the Kelurahan role.
  - `dashboard/`: Dashboard with summary and charts.
  - `rw-management/`: Management of RW accounts.
  - `ppsu-price-list/`: Management of master prices for RW/PPSU.
- `src/lib/api/`: Contains API service functions organized by role.
  - `rw/`: API calls specific to RW.
  - `kelurahan/`: API calls specific to Kelurahan.
  - `shared/`: Shared API calls (Auth, Waste Types, etc.).
- `src/types/`: TypeScript interfaces for all entities.
- `src/components/common/`: Reusable components like `DataTable`, `SummaryCard`.
- `src/layout/`: Layout components including `RoleBasedSidebar`.

## Key Components

- **RoleBasedSidebar**: A dynamic sidebar that renders menu items based on the user's role.
- **DataTable**: A reusable table component for displaying lists of data.
- **SummaryCard**: A card component for dashboard metrics.

## API Integration

- `src/lib/axios.ts`: Configured Axios instance with interceptors for JWT auth (using localStorage).
- API functions return typed data based on interfaces in `src/types/index.ts`.

## Completed Features

- [x] Project Structure & Types
- [x] Role-based Layouts & Sidebar
- [x] Authentication (Mocked Login)
- [x] RW Dashboard
- [x] RW Transactions List
- [x] RW Online Requests List
- [x] RW Price List
- [x] RW Schedules
- [x] RW Bulk Sales
- [x] Kelurahan Dashboard
- [x] Kelurahan RW Management
- [x] Kelurahan Price List
- [x] Kelurahan Schedules
- [x] Kelurahan Bulk Sales
- [x] RW Reports
- [x] RW Settings
- [x] Kelurahan Reports
- [x] Kelurahan Settings

## Next Steps

1.  Connect the API functions to the actual backend endpoints.
