-- CreateTable
CREATE TABLE "purchase_order_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "po_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "unit_price" DECIMAL(18,2) NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "purchase_order_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "purchase_order_line_items_po_id_idx" ON "purchase_order_line_items"("po_id");

-- CreateIndex
CREATE INDEX "purchase_order_line_items_item_id_idx" ON "purchase_order_line_items"("item_id");

-- AddForeignKey
ALTER TABLE "purchase_order_line_items" ADD CONSTRAINT "purchase_order_line_items_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_line_items" ADD CONSTRAINT "purchase_order_line_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;