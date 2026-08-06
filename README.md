# Akshatha Prosthodontist — Premium Next.js + Clinic Backend

## Run

```bash
cd akshatha-prosthodontist
npm install
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

### Staff logins

| Role | Username | Password |
|------|----------|----------|
| Doctor | `doctor` | `doctor2026` |
| Assistant | `assistant` | `assist2026` |

## Patient booking flow

1. Fill name, phone, email, treatment, message
2. Pick **date + open time slot (IST)**
3. **Send OTP** → verify phone
4. Submit → lead saved as `pending`, slot reserved
5. Admin clicks **Confirm → WhatsApp** → patient gets confirmation

## OTP options (backend ready)

| Option | Best for | Env vars |
|--------|----------|----------|
| **MSG91 SMS** (recommended India) | Reliable phone OTP | `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` |
| **Twilio SMS** | Global / US | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| **WhatsApp Cloud API** | Same channel as confirmations | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` |
| **Dev mode** (default now) | Local testing | OTP shown in UI + server log |

First configured provider wins. Without SMS/WA keys, OTP still works in **dev mode**.

## WhatsApp confirmation

On admin **Confirm**:
1. Tries WhatsApp Cloud API auto-send (if configured)
2. Else opens `wa.me` chat to the patient with pre-filled confirmation (staff taps Send)

## Admin lead columns (IST)

Submitted (IST) · Slot (IST) · Name · Phone · Email · Treatment · Message · Status · Actions

## Structure

```
src/lib/          db, auth, otp, slots, time(IST), whatsapp
src/app/api/      slots, otp, appointments, admin/*
src/app/admin/    login + dashboard
data/clinic.json  local database (auto-created)
```
