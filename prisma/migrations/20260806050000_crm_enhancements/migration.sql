-- AlterTable: add CRM fields to Consultation
ALTER TABLE "Consultation" ADD COLUMN "visitType"     TEXT NOT NULL DEFAULT 'consultation';
ALTER TABLE "Consultation" ADD COLUMN "paymentMode"   TEXT;
ALTER TABLE "Consultation" ADD COLUMN "paymentAmount" DOUBLE PRECISION;
ALTER TABLE "Consultation" ADD COLUMN "transactionId" TEXT;
ALTER TABLE "Consultation" ADD COLUMN "invoiceSent"   BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: Document (X-rays, reports, prescriptions)
CREATE TABLE "Document" (
    "id"             TEXT NOT NULL,
    "leadId"         TEXT NOT NULL,
    "patientPhone"   TEXT NOT NULL DEFAULT '',
    "fileName"       TEXT NOT NULL,
    "fileUrl"        TEXT NOT NULL,
    "fileSize"       INTEGER,
    "mimeType"       TEXT NOT NULL DEFAULT '',
    "docType"        TEXT NOT NULL DEFAULT 'other',
    "uploadedById"   TEXT NOT NULL,
    "consultationId" TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_consultationId_fkey"
    FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
