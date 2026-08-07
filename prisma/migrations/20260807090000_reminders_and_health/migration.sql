-- Add reminder tracking fields to Lead
ALTER TABLE "Lead" ADD COLUMN "reminder24hSent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Lead" ADD COLUMN "reminder1hSent" BOOLEAN NOT NULL DEFAULT false;

-- Create MedicalHistory table
CREATE TABLE "MedicalHistory" (
    "id" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL DEFAULT '',
    "allergies" TEXT NOT NULL DEFAULT '',
    "currentMedications" TEXT NOT NULL DEFAULT '',
    "medicalConditions" TEXT NOT NULL DEFAULT '',
    "smokingStatus" TEXT NOT NULL DEFAULT '',
    "isPregnant" TEXT NOT NULL DEFAULT '',
    "dentalConcerns" TEXT NOT NULL DEFAULT '',
    "emergencyContactName" TEXT NOT NULL DEFAULT '',
    "emergencyContactPhone" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- Create unique index on patientPhone
CREATE UNIQUE INDEX "MedicalHistory_patientPhone_key" ON "MedicalHistory"("patientPhone");

-- Add foreign key constraint
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_patientPhone_fkey"
  FOREIGN KEY ("patientPhone") REFERENCES "Patient"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;
