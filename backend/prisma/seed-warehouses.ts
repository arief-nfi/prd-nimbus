import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedWarehouses() {
  console.log('Starting warehouse seeding...');

  try {
    // Create main warehouse
    const mainWarehouse = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001',
        name: 'Main Distribution Center',
        nodeType: 'Warehouse',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Main Distribution Center');

    // Create aisles in main warehouse
    const aisle1 = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001-A01',
        name: 'Aisle A',
        nodeType: 'Aisle',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        parentId: mainWarehouse.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Aisle A');

    const aisle2 = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001-A02',
        name: 'Aisle B',
        nodeType: 'Aisle',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        parentId: mainWarehouse.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Aisle B');

    // Create racks in Aisle A
    const rack1 = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001-A01-R01',
        name: 'Rack 1',
        nodeType: 'Rack',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        parentId: aisle1.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Rack 1 in Aisle A');

    const rack2 = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001-A01-R02',
        name: 'Rack 2',
        nodeType: 'Rack',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        parentId: aisle1.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Rack 2 in Aisle A');

    // Create bins in Rack 1
    await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001-A01-R01-B01',
        name: 'Bin 1',
        nodeType: 'Bin',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        parentId: rack1.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Bin 1 in Rack 1');

    await prisma.warehouse.create({
      data: {
        nodeId: 'WH-001-A01-R01-B02',
        name: 'Bin 2',
        nodeType: 'Bin',
        method: 'DIRECT',
        address: '123 Industrial Park, New York, NY 10001',
        status: 'ACTIVE',
        parentId: rack1.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Bin 2 in Rack 1');

    // Create second warehouse
    const warehouse2 = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-002',
        name: 'East Coast Warehouse',
        nodeType: 'Warehouse',
        method: 'DISTRIBUTION',
        address: '456 Commerce Street, Boston, MA 02101',
        status: 'ACTIVE',
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created East Coast Warehouse');

    // Create an aisle in second warehouse
    const aisle3 = await prisma.warehouse.create({
      data: {
        nodeId: 'WH-002-A01',
        name: 'Aisle C',
        nodeType: 'Aisle',
        method: 'DISTRIBUTION',
        address: '456 Commerce Street, Boston, MA 02101',
        status: 'ACTIVE',
        parentId: warehouse2.id,
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Aisle C in East Coast Warehouse');

    // Create inactive warehouse for testing
    await prisma.warehouse.create({
      data: {
        nodeId: 'WH-003',
        name: 'Old Warehouse (Maintenance)',
        nodeType: 'Warehouse',
        method: 'DIRECT',
        address: '789 Legacy Road, Newark, NJ 07102',
        status: 'MAINTENANCE',
        createdBy: 'seed-script',
        updatedBy: 'seed-script',
      },
    });
    console.log('✓ Created Maintenance Warehouse');

    console.log('\n✅ Warehouse seeding completed successfully!');
    console.log('Total warehouses created: 11');
  } catch (error) {
    console.error('❌ Error seeding warehouses:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedWarehouses()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
