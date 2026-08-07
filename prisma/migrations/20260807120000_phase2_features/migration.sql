-- Phase 2 Features: Treatment Plans, Feedback, Lab Work, Gallery, Patient DOB/Recall

-- Patient: add dob and lastRecallAt
ALTER TABLE "Patient" ADD COLUMN "dob" TEXT;
ALTER TABLE "Patient" ADD COLUMN "lastRecallAt" TIMESTAMP(3);

-- TreatmentPlan
CREATE TABLE "TreatmentPlan" (
    "id"           TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "title"        TEXT NOT NULL,
    "notes"        TEXT NOT NULL DEFAULT '',
    "totalCost"    DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'draft',
    "createdById"  TEXT NOT NULL,
    "sharedAt"     TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TreatmentPlan_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_patientPhone_fkey"
    FOREIGN KEY ("patientPhone") REFERENCES "Patient"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "StaffUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- TreatmentPlanPhase
CREATE TABLE "TreatmentPlanPhase" (
    "id"            TEXT NOT NULL,
    "planId"        TEXT NOT NULL,
    "phaseNumber"   INTEGER NOT NULL,
    "title"         TEXT NOT NULL,
    "description"   TEXT NOT NULL DEFAULT '',
    "estimatedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duration"      TEXT NOT NULL DEFAULT '',
    "isCompleted"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TreatmentPlanPhase_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TreatmentPlanPhase" ADD CONSTRAINT "TreatmentPlanPhase_planId_fkey"
    FOREIGN KEY ("planId") REFERENCES "TreatmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- VisitFeedback
CREATE TABLE "VisitFeedback" (
    "id"              TEXT NOT NULL,
    "token"           TEXT NOT NULL,
    "leadId"          TEXT NOT NULL,
    "patientPhone"    TEXT NOT NULL,
    "rating"          INTEGER,
    "comment"         TEXT NOT NULL DEFAULT '',
    "reviewRequested" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt"     TIMESTAMP(3),
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VisitFeedback_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VisitFeedback_token_key" ON "VisitFeedback"("token");
CREATE UNIQUE INDEX "VisitFeedback_leadId_key" ON "VisitFeedback"("leadId");

ALTER TABLE "VisitFeedback" ADD CONSTRAINT "VisitFeedback_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- LabWork
CREATE TABLE "LabWork" (
    "id"           TEXT NOT NULL,
    "leadId"       TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "patientName"  TEXT NOT NULL DEFAULT '',
    "labName"      TEXT NOT NULL,
    "workType"     TEXT NOT NULL DEFAULT 'other',
    "description"  TEXT NOT NULL DEFAULT '',
    "sentDate"     TEXT NOT NULL,
    "expectedDate" TEXT,
    "receivedDate" TEXT,
    "status"       TEXT NOT NULL DEFAULT 'sent',
    "notes"        TEXT NOT NULL DEFAULT '',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LabWork_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "LabWork" ADD CONSTRAINT "LabWork_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- GalleryCase
CREATE TABLE "GalleryCase" (
    "id"          TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "treatment"   TEXT NOT NULL DEFAULT '',
    "beforeUrl"   TEXT NOT NULL,
    "afterUrl"    TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "isPublic"    BOOLEAN NOT NULL DEFAULT true,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GalleryCase_pkey" PRIMARY KEY ("id")
);
