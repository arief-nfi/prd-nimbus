-- CreateEnum
CREATE TYPE "WarehouseNodeType" AS ENUM ('Warehouse', 'Aisle', 'Rack', 'Bin');
CREATE TYPE "WarehouseMethod" AS ENUM ('FIFO', 'LIFO', 'FEFO');
CREATE TYPE "WarehouseStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "node_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parent_id" UUID,
    "node_type" "WarehouseNodeType" NOT NULL,
    "method" "WarehouseMethod" NOT NULL DEFAULT 'FIFO',
    "address" TEXT NOT NULL,
    "description" TEXT,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_node_id_key" ON "warehouses"("node_id");
CREATE UNIQUE INDEX "warehouses_name_key" ON "warehouses"("name");
CREATE INDEX "idx_warehouses_parent_id" ON "warehouses"("parent_id");
CREATE INDEX "idx_warehouses_created_at" ON "warehouses"("created_at");
CREATE INDEX "idx_warehouses_deleted_at" ON "warehouses"("deleted_at");
CREATE INDEX "idx_warehouses_created_at_id" ON "warehouses"("created_at", "id");

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;