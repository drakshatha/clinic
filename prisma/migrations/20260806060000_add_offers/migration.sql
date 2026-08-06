-- CreateTable: Offer (clinic promotions shown as public banner)
CREATE TABLE "Offer" (
    "id"          TEXT NOT NULL,
    "badge"       TEXT NOT NULL DEFAULT 'OFFER',
    "title"       TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "validUntil"  TEXT,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);
