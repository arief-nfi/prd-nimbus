-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supp_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "pic_name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "status" "SupplierStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_supp_id_key" ON "suppliers"("supp_id");

-- CreateIndex
CREATE INDEX "idx_suppliers_created_at" ON "suppliers"("created_at");

-- CreateIndex
CREATE INDEX "idx_suppliers_deleted_at" ON "suppliers"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_suppliers_pagination" ON "suppliers"("created_at", "id");