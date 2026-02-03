-- CreateTable
CREATE TABLE "uoms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uom_id" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'Active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID,

    CONSTRAINT "uoms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uoms_uom_id_key" ON "uoms"("uom_id");

-- CreateIndex
CREATE UNIQUE INDEX "uoms_code_key" ON "uoms"("code");

-- CreateIndex
CREATE INDEX "idx_uoms_created_at" ON "uoms"("created_at");

-- CreateIndex
CREATE INDEX "idx_uoms_deleted_at" ON "uoms"("deleted_at");