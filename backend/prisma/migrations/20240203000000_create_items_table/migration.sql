-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "uom_id" UUID NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_sku_key" ON "items"("sku");

-- CreateIndex
CREATE INDEX "idx_items_uom_id" ON "items"("uom_id");

-- CreateIndex
CREATE INDEX "idx_items_created_at" ON "items"("created_at");

-- CreateIndex
CREATE INDEX "idx_items_deleted_at" ON "items"("deleted_at");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;