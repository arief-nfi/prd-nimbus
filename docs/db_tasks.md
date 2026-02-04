## database-migration

### TASK-002: Create database migration for Warehouse

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "warehouses" with all required columns, constraints, and indexes

**Context:** This migration creates the master entity "Warehouse" which stores Physical storage contexts using a tree hierarchy (Warehouse, Aisle, Rack, Bin).

**Requirements:**
- Create table "warehouses" with 15 columns
- Set primary key on "id" column with UUID type
- Column "node_id" must be NOT NULL
- Column "name" must be NOT NULL
- Column "node_type" must be NOT NULL
- Column "method" must be NOT NULL
- Column "address" must be NOT NULL
- Column "status" must be NOT NULL
- Column "created_at" must be NOT NULL
- Column "updated_at" must be NOT NULL
- Column "node_id" must have UNIQUE constraint
- Column "name" must have UNIQUE constraint
- Add audit columns: created_at, created_by, updated_at, updated_by
- Add soft delete columns: deleted_at, deleted_by

**Acceptance Criteria:**
- Table "warehouses" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "warehouses" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-003: Create database migration for Supplier

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "suppliers" with all required columns, constraints, and indexes

**Context:** This migration creates the master entity "Supplier" which stores External partners/vendors.

**Requirements:**
- Create table "suppliers" with 13 columns
- Set primary key on "id" column with UUID type
- Column "supp_id" must be NOT NULL
- Column "name" must be NOT NULL
- Column "pic_name" must be NOT NULL
- Column "address" must be NOT NULL
- Column "phone" must be NOT NULL
- Column "created_at" must be NOT NULL
- Column "updated_at" must be NOT NULL
- Column "supp_id" must have UNIQUE constraint
- Add audit columns: created_at, created_by, updated_at, updated_by
- Add soft delete columns: deleted_at, deleted_by

**Acceptance Criteria:**
- Table "suppliers" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "suppliers" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-004: Create database migration for Item

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "items" with all required columns, constraints, and indexes

**Context:** This migration creates the master entity "Item" which stores Tradeable products and SKUs.

**Requirements:**
- Create table "items" with 12 columns
- Set primary key on "id" column with UUID type
- Column "sku" must be NOT NULL
- Column "name" must be NOT NULL
- Column "uom_id" must be NOT NULL
- Column "created_at" must be NOT NULL
- Column "updated_at" must be NOT NULL
- Column "sku" must have UNIQUE constraint
- Add audit columns: created_at, created_by, updated_at, updated_by
- Add soft delete columns: deleted_at, deleted_by

**Acceptance Criteria:**
- Table "items" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "items" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-005: Create database migration for Uom

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "uoms" with all required columns, constraints, and indexes

**Context:** This migration creates the reference entity "Uom" which stores Measurement units for items.

**Requirements:**
- Create table "uoms" with 11 columns
- Set primary key on "id" column with UUID type
- Column "uom_id" must be NOT NULL
- Column "code" must be NOT NULL
- Column "name" must be NOT NULL
- Column "created_at" must be NOT NULL
- Column "updated_at" must be NOT NULL
- Column "uom_id" must have UNIQUE constraint
- Column "code" must have UNIQUE constraint
- Add audit columns: created_at, created_by, updated_at, updated_by
- Add soft delete columns: deleted_at, deleted_by

**Acceptance Criteria:**
- Table "uoms" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "uoms" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-006: Create database migration for Inventory

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "inventories" with all required columns, constraints, and indexes

**Context:** This migration creates the transaction entity "Inventory" which stores Stock levels per Item per Warehouse/Bin.

**Requirements:**
- Create table "inventories" with 7 columns
- Set primary key on "id" column with UUID type
- Column "item_id" must be NOT NULL
- Column "warehouse_id" must be NOT NULL
- Column "qty_on_hand" must be NOT NULL

**Acceptance Criteria:**
- Table "inventories" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "inventories" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-007: Create database migration for PurchaseOrder

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "purchase_orders" with all required columns, constraints, and indexes

**Context:** This migration creates the transaction entity "PurchaseOrder" which stores Order documents for procurement.

**Requirements:**
- Create table "purchase_orders" with 15 columns
- Set primary key on "id" column with UUID type
- Column "po_id" must be NOT NULL
- Column "po_date" must be NOT NULL
- Column "supplier_id" must be NOT NULL
- Column "distribution_method" must be NOT NULL
- Column "warehouse_id" must be NOT NULL
- Column "grand_total" must be NOT NULL
- Column "payment_method" must be NOT NULL
- Column "created_at" must be NOT NULL
- Column "updated_at" must be NOT NULL
- Column "po_id" must have UNIQUE constraint
- Add audit columns: created_at, created_by, updated_at, updated_by
- Add soft delete columns: deleted_at, deleted_by

**Acceptance Criteria:**
- Table "purchase_orders" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "purchase_orders" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-008: Create database migration for PurchaseOrderLineItem

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "purchase_order_line_items" with all required columns, constraints, and indexes

**Context:** This migration creates the transaction entity "PurchaseOrderLineItem" which stores entity data

**Requirements:**
- Create table "purchase_order_line_items" with 6 columns
- Set primary key on "id" column with UUID type
- Column "po_id" must be NOT NULL
- Column "item_id" must be NOT NULL
- Column "quantity" must be NOT NULL
- Column "unit_price" must be NOT NULL
- Column "total_amount" must be NOT NULL

**Acceptance Criteria:**
- Table "purchase_order_line_items" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "purchase_order_line_items" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state

---

### TASK-009: Create database migration for PoAttachment

**Type:** database-migration | **Tier:** T1 | **Priority:** critical

**Objective:** Create the database table "po_attachments" with all required columns, constraints, and indexes

**Context:** This migration creates the transaction entity "PoAttachment" which stores entity data

**Requirements:**
- Create table "po_attachments" with 8 columns
- Set primary key on "id" column with UUID type
- Column "po_id" must be NOT NULL
- Column "file_path" must be NOT NULL
- Column "created_at" must be NOT NULL
- Column "updated_at" must be NOT NULL
- Column "po_id" must have UNIQUE constraint
- Add audit columns: created_at, created_by, updated_at, updated_by

**Acceptance Criteria:**
- Table "po_attachments" exists in the database
- All columns have correct data types and constraints
- Indexes are created for frequently queried columns
- Foreign key constraints are properly defined
- Migration can be rolled back without data loss

**Test Cases:**
- **Table creation:** Given Empty database, when Migration is run, then Table "po_attachments" exists with correct schema
- **Rollback:** Given Migration has been applied, when Rollback is executed, then Table is dropped and database returns to previous state