-- CreateIndex
CREATE INDEX "Consultation_completedAt_idx" ON "Consultation"("completedAt");

-- CreateIndex
CREATE INDEX "Consultation_patientPhone_idx" ON "Consultation"("patientPhone");

-- CreateIndex
CREATE INDEX "Lead_slotDate_idx" ON "Lead"("slotDate");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_patientPhone_idx" ON "Lead"("patientPhone");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Patient_lastSeen_idx" ON "Patient"("lastSeen");

-- CreateIndex
CREATE INDEX "Patient_lastRecallAt_idx" ON "Patient"("lastRecallAt");
