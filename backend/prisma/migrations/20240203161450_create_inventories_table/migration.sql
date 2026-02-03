-- CreateTable
CREATE TABLE "inventories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "bin_id" UUID,
    "qty_on_hand" DECIMAL(18,2) NOT NULL,
    "last_received_at" TIMESTAMPTZ,
    "last_po_id" UUID,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_inventories_item_id" ON "inventories"("item_id");

-- CreateIndex
CREATE INDEX "idx_inventories_warehouse_id" ON "inventories"("warehouse_id");

-- CreateIndex
CREATE INDEX "idx_inventories_bin_id" ON "inventories"("bin_id");

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;