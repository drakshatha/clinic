# Akshatha Dental Clinic — System Reference

Full reference for the clinic management platform at **drakshatha.in**.
Use this as context when building integrations (e.g. AI receptionist).

---

## Clinic Details

| Field | Value |
|---|---|
| Name | Akshatha Dental Clinic |
| Doctor | Dr. Akshatha V, MDS Prosthodontist & Implantologist |
| Location | K M Arcade, Mahalakshmi Layout, Bengaluru 560096 |
| Phone | +91 63643 49943 |
| WhatsApp | 916364349943 |
| Email | care@akshathadental.com |
| Hours | 11:00 AM – 9:30 PM · Daily |
| Website | https://drakshatha.in |
| Google Review Link | https://g.page/r/CcptNvhnF_qkEBE/review |

---

## Services Offered

| Slug | Service | Starting From |
|---|---|---|
| `dental-implants` | Dental Implants | ₹25,000 |
| `full-mouth-rehabilitation` | Full Mouth Rehabilitation | ₹50,000+ |
| `crowns-bridges` | Crowns & Bridges | ₹8,000 |
| `dentures` | Complete & Partial Dentures | ₹15,000 |
| `cosmetic-smile-makeover` | Cosmetic Smile Makeover | ₹15,000 |

---

## Architecture Overview

```
Next.js 16 (App Router) on Vercel
├── Public website       /
├── Admin panel          /admin/*        (JWT, staff login)
├── Patient portal       /patient/*      (OTP login via SMS/WhatsApp)
├── Content editor       /edit/*         (separate JWT, editor login)
└── API routes           /api/*
```

**Database:** Neon PostgreSQL (Singapore) via Prisma ORM  
**File storage:** Vercel Blob  
**Messaging:** WhatsApp Business API (Meta), MSG91 SMS, Twilio SMS (fallback)

---

## Database Models

| Model | Purpose |
|---|---|
| `StaffUser` | Admin/staff accounts with role-based permissions |
| `Session` | Admin sessions (JWT stored in HttpOnly cookie) |
| `Lead` | Appointment bookings / patient enquiries |
| `BlockedSlot` | Admin-blocked calendar slots |
| `OtpRecord` | Patient OTP records for portal login |
| `Patient` | Patient profiles (phone-keyed, linked to leads) |
| `PatientSession` | Patient portal sessions |
| `Consultation` | Completed visit records with payment info |
| `MedicalHistory` | Patient intake form — allergies, conditions, medications |
| `Document` | Files attached to leads (Vercel Blob) |
| `TreatmentPlan` + `TreatmentPlanPhase` | Multi-phase treatment plans with cost estimates |
| `VisitFeedback` | Token-based post-visit feedback (triggers Google review) |
| `LabWork` | Crown/bridge/denture lab orders tracker |
| `GalleryCase` | Before/after photo cases (Vercel Blob) |
| `DentalChart` | Per-patient dental chart with tooth-level notes |
| `PatientImage` | Patient X-rays and clinical images (Vercel Blob) |
| `ConsentForm` | Digital consent forms |
| `Prescription` | Digital prescriptions with medicines |
| `InventoryItem` + `InventoryLog` | Clinic supply inventory tracking |
| `Offer` | Promotional offers shown on website |
| `ServiceContent` | Admin-editable service descriptions |
| `SiteFaq` | Admin-editable FAQ entries |
| `SiteSetting` | Key-value site settings (stats, API keys, etc.) |

---

## Public API Endpoints (no auth required)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/appointments` | Submit a new appointment booking from the website form |
| GET | `/api/slots` | Get available appointment slots for a given date |
| POST | `/api/otp/send` | Send OTP to patient phone for portal login |
| POST | `/api/otp/verify` | Verify OTP code |
| GET | `/api/public/gallery` | Get published before/after gallery cases |
| GET | `/api/public/offers` | Get active promotional offers |
| GET | `/api/public/feedback/[token]` | Get feedback form by token |
| POST | `/api/public/feedback/[token]` | Submit patient feedback |
| GET | `/api/health` | Health check |
| GET | `/api/cron/warm-db` | DB keep-warm ping (used by UptimeRobot) |

---

## Admin API Endpoints (require admin JWT cookie)

### Leads / Appointments
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/leads` | List all leads (add `?slim=true` for lightweight list) |
| POST | `/api/admin/leads` | Create a new lead manually |
| PATCH | `/api/admin/leads/[id]` | Update lead status, treatment, notes |
| POST | `/api/admin/leads/[id]/confirm` | Confirm appointment + send WhatsApp to patient |
| POST | `/api/admin/leads/[id]/complete` | Mark visit complete + trigger feedback WhatsApp |
| GET | `/api/admin/leads/[id]/documents` | List documents for a lead |
| POST | `/api/admin/leads/[id]/documents` | Upload document to lead |
| DELETE | `/api/admin/leads/[id]/documents` | Delete a document |

### Patients
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/patients` | List all patients with visit history |
| PATCH | `/api/admin/patients` | Update patient DOB |
| GET | `/api/admin/patients/medical-history` | Get patient medical history by phone |

### Calendar & Slots
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/calendar` | Get calendar view with all leads |
| POST | `/api/admin/slots` | Block a time slot |
| DELETE | `/api/admin/slots` | Unblock a time slot |

### Payments
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/payments` | List all consultations with payment info |
| PATCH | `/api/admin/payments` | Record/update payment for a consultation |

### Treatment Plans
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/treatment-plans` | List all treatment plans |
| POST | `/api/admin/treatment-plans` | Create a new treatment plan |
| GET | `/api/admin/treatment-plans/[id]` | Get one plan with phases |
| DELETE | `/api/admin/treatment-plans/[id]` | Delete a plan |
| POST | `/api/admin/treatment-plans/[id]` | Share plan via WhatsApp |

### Reminders
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/reminders` | List reminder history |
| POST | `/api/admin/reminders` | Send a manual WhatsApp reminder |
| GET | `/api/admin/reminders-preview` | Preview upcoming reminders |
| POST | `/api/admin/reminders-run` | Run the reminder batch now |

### Recall & Birthday
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/recall` | List recall-eligible patients |
| POST | `/api/admin/recall` | Send recall WhatsApp to a patient |
| GET | `/api/admin/birthday` | List today's birthdays |
| POST | `/api/admin/birthday` | Send birthday WhatsApp |

### Clinical
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/dental-chart` | Get dental chart for a patient |
| GET/POST | `/api/admin/prescriptions` | List / create prescriptions |
| GET/DELETE | `/api/admin/prescriptions/[id]` | Get / delete a prescription |
| GET/POST | `/api/admin/consent-forms` | List / create consent forms |
| GET/PATCH/DELETE | `/api/admin/consent-forms/[id]` | Manage a consent form |
| GET/POST | `/api/admin/patient-images` | List / upload patient images |
| DELETE | `/api/admin/patient-images/[id]` | Delete a patient image |

### Lab Work
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/lab-work` | List all lab orders |
| POST | `/api/admin/lab-work` | Create a lab order |
| DELETE | `/api/admin/lab-work` | Delete a lab order |

### Gallery
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/gallery` | List gallery cases |
| POST | `/api/admin/gallery` | Upload a before/after case |
| DELETE | `/api/admin/gallery` | Delete a gallery case |

### Inventory
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/inventory` | List inventory items |
| POST | `/api/admin/inventory` | Add an inventory item |
| PATCH/DELETE | `/api/admin/inventory/[id]` | Update / delete item |

### Dashboard & Analytics
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard stats (leads, revenue, appointments) |
| GET | `/api/admin/analytics` | Extended analytics data |

### Other Admin
| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/api/admin/settings` | Read / update site settings |
| GET/POST | `/api/admin/offers` | List / create promotional offers |
| PATCH/DELETE | `/api/admin/offers/[id]` | Update / delete offer |
| POST | `/api/admin/offers/upload` | Upload offer image |
| GET | `/api/admin/invoice/[leadId]` | Get HTML invoice for a lead |
| GET/POST | `/api/admin/staff` | List / create staff accounts |
| PATCH/DELETE | `/api/admin/staff/[id]` | Update / delete staff account |

---

## Patient Portal API (require patient JWT cookie)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/patient/login` | Patient login (after OTP verify) |
| POST | `/api/patient/logout` | Patient logout |
| GET | `/api/patient/me` | Get logged-in patient's profile + history |
| GET | `/api/patient/treatment-plans` | Get patient's shared treatment plans |
| GET | `/api/patient/health` | Patient portal health check |

---

## WhatsApp Message Types

All sent via Meta Cloud API v19.0. The system sends:

| Trigger | Message |
|---|---|
| New appointment booking | Clinic notification (internal) |
| Admin confirms appointment | Patient confirmation with date/time/address |
| 24h before appointment | Reminder to patient |
| 1h before appointment | Reminder to patient |
| Visit marked complete | Post-visit feedback request with link |
| 4-5 star feedback | Google review link sent to patient |
| Treatment plan shared | Full plan with phases + costs |
| Payment overdue | Payment reminder |
| No visit in 6+ months | Recall / re-engagement message |
| Patient birthday | Birthday greeting with offer |

---

## Lead Status Flow

```
pending → confirmed → completed
           ↓
        cancelled
           ↓
        no_show
```

---

## Admin Panel Pages

| URL | Page |
|---|---|
| `/admin` | Login |
| `/admin/dashboard` | Dashboard with stats + upcoming appointments |
| `/admin/leads` | All leads / appointment bookings |
| `/admin/calendar` | Calendar view |
| `/admin/patients` | Patient profiles with history |
| `/admin/payments` | Payment tracking |
| `/admin/treatment-plans` | Treatment plan builder |
| `/admin/lab-work` | Lab order tracker |
| `/admin/recall` | Recall management |
| `/admin/gallery` | Before/after gallery management |
| `/admin/inventory` | Supply inventory |
| `/admin/staff` | Staff account management |
| `/admin/stack` | Tech stack reference (this system) |
| `/admin/settings` | Site settings, stats, API key config |

---

## Appointment Booking Flow

1. Patient fills form on `/contact` → POST `/api/appointments`
2. Lead created in DB with status `pending`
3. Admin sees it in `/admin/leads` and `/admin/dashboard`
4. Admin clicks **Confirm** → POST `/api/admin/leads/[id]/confirm` → WhatsApp sent to patient
5. Lead status → `confirmed`
6. Day-before and 1h-before reminders sent automatically
7. Admin marks visit complete → POST `/api/admin/leads/[id]/complete`
8. Consultation record created, feedback WhatsApp sent to patient
9. Patient rates 4-5★ → Google review link auto-sent

---

## Key Technical Notes

- **Auth:** HttpOnly JWT cookies. Admin: `admin_session` cookie. Patient: `patient_session` cookie.
- **OTP:** 6-digit code, 5-minute expiry, max 5 attempts. Sent via MSG91 → Twilio → WhatsApp fallback chain.
- **Passwords:** SHA-256 hash (no salt). Stored in `StaffUser.passwordHash`.
- **Date format:** Slot dates stored as `YYYY-MM-DD` strings. Times stored as `HH:MM` strings (24h).
- **Phone format:** Stored as `91XXXXXXXXXX` (12 digits with country code). Normalisation in `src/lib/whatsapp.ts`.
- **Caching:** API routes return `Cache-Control: private, max-age=30, stale-while-revalidate=60`.
- **DB keep-warm:** `/api/cron/warm-db` runs `SELECT 1`. UptimeRobot hits it every 5 min.
