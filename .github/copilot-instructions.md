# PRD Nimbus - AI Coding Instructions

## Project Overview
PRD Nimbus is a **PERN stack inventory/procurement management system** with a monorepo structure. The application handles warehouses (hierarchical tree structure), suppliers, items, purchase orders, and inventory tracking. This codebase was generated from PRD-to-Tasks specifications and uses a repository pattern with transaction support.

## Architecture

### Monorepo Structure
- `backend/` - Express API with Prisma ORM (runs on port 3001)
- `frontend/` - React + Vite SPA (runs on port 5173)
- `shared/` - Shared Zod validation schemas used by both backend and frontend

### Backend Layers (Repository Pattern)
```
routes/ -> services/ -> repositories/ -> Prisma Client
```
- **Routes**: REST endpoints, apply middleware validation, call services
- **Services**: Business logic, orchestrate transactions, use repositories
- **Repositories**: Data access layer, accept optional `tx` (transaction client) parameter
- **Middleware**: Zod schema validation via `validate()` or specific validators

### Key Data Models
The app manages these primary entities:
- `Warehouse` - Hierarchical nodes (Warehouse → Aisle → Rack → Bin)
- `Supplier` - External vendors with unique `supp_id`
- `Item` - Products/SKUs with UOM relationships
- `PurchaseOrder` - POs with line items and attachments
- `Inventory` - Stock levels per warehouse node
- `Uom` - Units of measure (soft delete with active item count validation)

All models use:
- UUID primary keys (`@id @default(uuid())`)
- Audit fields: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Soft delete: `deletedAt`, `deletedBy` (always filter `deletedAt: null` in queries)

## Critical Patterns

### 1. Validation with Zod (Shared Schemas)
All validation schemas live in `shared/validation/*.schema.ts` and are imported by both backend and frontend.

**Key Convention**: Schemas document validation rules with `VR-XXX` identifiers in comments:
```typescript
/**
 * VR-005: Date validation for Purchase Orders
 * Ensures Required Date is not earlier than PO Date
 */
export const purchaseOrderSchema = z.object({
  // ... fields
}).refine((data) => {
  const po = new Date(data.poDate).setHours(0, 0, 0, 0);
  const req = new Date(data.requiredDate).setHours(0, 0, 0, 0);
  return req >= po;
}, {
  message: 'Required Date cannot be earlier than PO Date',
  path: ['requiredDate'],
});
```

**When adding validations**:
- Place in `shared/validation/`
- Export typed input: `export type XInput = z.infer<typeof xSchema>;`
- Document with `VR-XXX` comments if from specification
- Use `.refine()` for cross-field validations

### 2. Repository Transaction Pattern
Repositories **must accept optional transaction client** for atomic operations:
```typescript
async create(data: Prisma.XCreateInput, tx?: Prisma.TransactionClient): Promise<X> {
  const client = tx || this.prisma;
  return client.x.create({ data });
}
```

**Transaction usage in services**:
```typescript
return await prisma.$transaction(async (tx) => {
  await lineItemRepo.delete(id, tx);
  await poRepo.update(poId, { grandTotal: newTotal }, tx);
  return result;
});
```

### 3. Soft Delete Pattern
Always filter soft-deleted records:
```typescript
where: { id, deletedAt: null }  // Single record
where: { ...customWhere, deletedAt: null }  // List queries
```

Soft delete implementation:
```typescript
async softDelete(id: string, deletedBy: string): Promise<X> {
  return this.prisma.x.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy },
  });
}
```

### 4. Route Middleware Chain
Routes apply validation before handlers:
```typescript
router.post('/', validate(schema), async (req, res) => {
  // req.body is validated and typed
});
```

Multiple validation styles exist (project is mid-refactor):
- `validate(schema)` - Generic Zod validator
- `validateRequest(schema)` - Similar wrapper
- Specific validators: `validatePaymentRequest`, `validateDocumentUpload`, etc.

## Development Workflow

### Setup Commands
```bash
npm run install:all      # Install all workspace dependencies
npm run db:generate      # Generate Prisma client (required after schema changes)
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio (database GUI)
```

### Running the App
```bash
npm run dev              # Start both backend and frontend concurrently
npm run dev:backend      # Backend only (tsx watch)
npm run dev:frontend     # Frontend only (Vite)
```

### Working with Database Schema
1. Modify `backend/prisma/schema.prisma`
2. Run `npm run db:generate` (regenerates Prisma client types)
3. Run `npm run db:push` (applies changes to database)
4. Import types: `import { X, Prisma } from '@prisma/client';`

**Complete Schema**: All 8 tables have been implemented with proper relationships:
- `warehouses` - Self-referencing hierarchy (parent_id)
- `suppliers` - Independent master table
- `uoms` - Referenced by items
- `items` - References uoms, referenced by inventories and line items
- `inventories` - Many-to-many between items and warehouses
- `purchase_orders` - References suppliers and warehouses
- `purchase_order_line_items` - References purchase_orders and items (CASCADE delete)
- `po_attachments` - References purchase_orders (CASCADE delete)

## Common Pitfalls

### Duplicate Route Files
Multiple route files exist for same entities (e.g., `purchase-order.ts`, `purchase-orders.ts`, `purchaseOrder.ts`). Check `backend/src/routes/index.ts` for which are actually mounted.

### Duplicate Service Files
Similar duplication in services (e.g., `purchase-order.service.ts` vs `purchaseOrder.service.ts`). The newer repository pattern files use kebab-case and accept transaction parameters.

### Validation Schema Duplication
Some schemas have both `x.schema.ts` and `x-schema.ts` variants. Prefer importing from `shared/validation/` to ensure consistency.

### Missing `.js` Extensions
Backend uses ES modules (`"type": "module"`). Import statements **must include `.js` extension**:
```typescript
import routes from './routes/index.js';  // ✓ Correct
import routes from './routes/index';     // ✗ Will fail
```

## Frontend Patterns

### API Integration
Frontend uses both `fetch` and `axios` (inconsistent):
- Services in `frontend/src/services/` use axios
- Some page components use raw fetch calls
- Backend runs on port 3001, accessed via `/api` prefix

### Component Naming
Components follow specification naming:
- Screen/Page components: `B70PurchaseOrderListScreen.tsx`
- Feature components: `C76FormPage.tsx`, `D21DashboardLayout.tsx`
- Pattern components: `TreeViewBehaviorPage.tsx`

### Lazy Loading
Routes use React lazy loading with Suspense for code splitting.

## Testing & Debugging

The codebase appears to lack automated tests. When debugging:
- Use `npm run db:studio` to inspect database state
- Backend logs validation errors to console with `[Validation Error]` prefix
- Check `docs/db_tasks.md` for original specification requirements

## Key Files Reference

- [backend/src/index.ts](backend/src/index.ts) - Server entry, Prisma initialization
- [backend/src/routes/index.ts](backend/src/routes/index.ts) - Route registry
- [shared/validation/](shared/validation/) - All Zod schemas
- [backend/src/repositories/](backend/src/repositories/) - Data access layer
- [docs/db_tasks.md](docs/db_tasks.md) - Database migration specifications
