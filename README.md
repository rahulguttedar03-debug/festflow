# CampusFlow — Intelligent College Event Management Platform

> **"Every Campus Event. One Connected Platform."**
> A modern, commercial-grade SaaS web application engineered to manage college festivals, cultural programs, technical hackathons, workshops, competitions, and seminars. Built with React, TypeScript, Tailwind CSS, Recharts, Framer Motion, and Supabase.

---

## 🌟 Key Personas & Core Workflows

CampusFlow seamlessly connects three distinct user roles with strict role-based access control and tailored experiences:

### 1. 🎓 Student Experience (`/student/dashboard`)
- **Event Discovery & Filtering:** Browse flagship campus fests, workshops, and hackathons with real-time seat tracking and category filters (`Technical`, `Cultural`, `Competitions`, `Workshops`, `Seminars`).
- **Instant Event Registration:** Automated capacity limits, registration deadline checks, and duplicate registration protection.
- **Parental Consent Workflow:** If an event has `parent_permission_required: true` (e.g. 24h overnight hackathons or outstation industrial tours), the registration is set to `Pending` until the linked parent grants consent.
- **Digital QR Entry Pass:** Generates a unique, scannable QR ticket token (`qrcode.react`) for contactless venue check-in.
- **Interactive Schedule:** Switch between a visual Calendar Month view and a sequential Timeline schedule.
- **Accredited Certificate Viewer:** Once attendance is marked as `Attended`, students can view and print/download an accredited university Certificate of Participation with unique verification codes.

### 2. 👨‍👩‍👦 Parent Portal (`/parent/dashboard`)
- **Verified Child Card:** Dedicated reassurance card displaying child name (`Alex Chen`), Student ID (`CS2024-089`), Department (`Computer Science`), study year, and verified link status.
- **Parental Permission Workflow:** Dedicated consent interface displaying event description, venue, departure time, and return itinerary. Parents can click **"Grant Official Permission"** or **"Decline Consent"** with instant updates and notifications dispatched to the student.
- **Attendance History Tracking:** Read-only inspection of officially logged check-ins (`Attended`, `Registered`, `Absent`).
- **Campus Announcements & Alerts:** Real-time bulletins from the Dean of Student Affairs, with high-priority banners for urgent campus notices.

### 3. 🛡️ Administrator Command Console (`/admin/dashboard`)
- **Event Publishing Suite:** Comprehensive event creation form with cover photo preview, start/end dates, eligibility filters (departments, study years), seat capacity, parent consent toggles, and certificate toggles.
- **Registration Management:** Searchable and filterable registrations table with status toggles (`Confirmed`, `Pending`, `Rejected`) and one-click **CSV export**.
- **Live Attendance Desk & QR Scanner:** Fast scanner input allowing administrative staff to scan or type student QR tokens for instant check-in verification.
- **Interactive University Analytics (Recharts):**
  - Registration & attendance velocity over time (`AreaChart`)
  - Category distribution (`PieChart`)
  - Department-wise participation rates (`BarChart`)
- **Announcement Dispatcher:** Broadcast targeted bulletins to students, parents, or specific departments.

---

## 🎨 Visual Identity & Design System

- **Primary:** Deep Navy `#111827`
- **Secondary:** Indigo `#6366F1`
- **Accent:** Violet `#8B5CF6`
- **Background:** `#F8FAFC` (Light) / `#0B0F19` (Dark)
- **Status Indicators:** Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`
- **Typography:** Plus Jakarta Sans & Inter
- **Micro-Interactions:** Subtle card elevations, confetti celebratory triggers, and glassmorphism headers.
- **Theme Support:** Fully responsive Dark Mode toggle in the navigation bar.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v18+` or `v22+`
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone <repository_url>
cd PUREE
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Creates an optimized, production-ready bundle in `dist/`.

---

## ⚡ Instant Persona Switcher & Demo Accounts

For immediate evaluation, CampusFlow includes an **Instant Persona Switcher** dropdown in the top navigation bar. You can switch between roles in one click:

| Role | Demo Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Student** | `alex.chen@campusflow.edu` | `password123` | Alex Chen (3rd Year, Computer Science) |
| **Parent** | `chen.family@gmail.com` | `password123` | David Chen (Linked to Alex Chen) |
| **Admin** | `admin@campusflow.edu` | `adminpassword123` | Dr. Robert Vance (Director of Student Affairs) |

---

## 🗄️ Database Setup & Supabase Integration

CampusFlow operates with dual-mode architecture:
1. **Zero-Config Persistent Mode:** Pre-configured with realistic campus data and localStorage synchronization so all registrations, approvals, attendance check-ins, and announcements work without requiring external cloud accounts.
2. **Production Supabase Integration:** Connect your Supabase project in seconds.

### Setting up Supabase:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your Supabase project credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the complete SQL migration located at `supabase/migrations/20261026000000_init_campusflow.sql` in your Supabase SQL Editor. It creates:
   - `profiles`
   - `parent_student_links`
   - `events`
   - `registrations`
   - `permission_requests`
   - `attendance`
   - `notifications`
   - `announcements`
   - `certificates`
   - Row Level Security (RLS) policies protecting student privacy and restricting admin privileges.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/
│   │   └── DashboardCharts.tsx       # Recharts area, pie, and department bar charts
│   ├── events/
│   │   ├── CertificateModal.tsx      # Official accredited certificate with printable template
│   │   ├── EventCard.tsx             # Interactive event card with capacity meter
│   │   ├── EventDetailModal.tsx      # Comprehensive event modal with registration checks
│   │   └── EventQrModal.tsx          # QR check-in token pass generator
│   ├── layout/
│   │   ├── Footer.tsx                # University footer with navigation & policy links
│   │   ├── Navbar.tsx                # Glassmorphism header with persona switcher & theme toggle
│   │   └── Sidebar.tsx               # Dynamic role-specific sidebar navigation
│   └── notifications/
│       └── NotificationDropdown.tsx  # Interactive notification dropdown
├── contexts/
│   ├── AuthContext.tsx               # Role authentication & session persistence
│   └── EventContext.tsx              # Reactive state for events, approvals, and attendance
├── hooks/
│   └── useTheme.tsx                  # Dark/light theme engine
├── lib/
│   ├── mockData.ts                   # Realistic university seed data & localStorage sync
│   ├── supabase.ts                   # Supabase client initializer
│   └── utils.ts                      # Styling helpers, dates, badge classes
├── pages/
│   ├── admin/
│   │   └── AdminDashboard.tsx        # Event publishing, registration table, QR scanner
│   ├── auth/
│   │   ├── AdminLoginPage.tsx        # Administrative login
│   │   ├── ParentLoginPage.tsx       # Parent login & registration
│   │   ├── RoleSelectPage.tsx        # Visual role selection
│   │   └── StudentLoginPage.tsx      # Student login & registration
│   ├── landing/
│   │   └── LandingPage.tsx           # High-converting public showcase & catalog
│   ├── parent/
│   │   └── ParentDashboard.tsx       # Parental consent workflow & child attendance
│   └── student/
│       └── StudentDashboard.tsx      # Registrations, schedule, QR ticket, certificates
├── routes/
│   └── AppRoutes.tsx                 # Client-side routing table
├── types/
│   └── index.ts                      # TypeScript data models and interfaces
├── App.tsx
├── index.css
└── main.tsx
```

---

## 🛡️ Security & Privacy Features

- **Row Level Security (RLS):** Database policies verify that parents can only inspect records for verified, linked students.
- **Administrative Guardrails:** Only authorized administrator roles can publish events, cancel sessions, or modify attendance records.
- **Duplicate Prevention:** Frontend and backend validation prevents duplicate event registrations.
- **No Secret Leaks:** Client bundle only contains public anonymous keys; service role keys are strictly excluded.
