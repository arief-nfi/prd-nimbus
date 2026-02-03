import { PrismaClient } from '@prisma/client';
import { getNodeSearchFilter } from '../utils/prisma-search-helper';
import { SearchQueryInput } from '../validations/search.schema';

const prisma = new PrismaClient();

export class MasterDataService {
  /**
   * Implementation of VR-010 for Master Data Node searching
   */
  async searchNodes(input: SearchQueryInput) {
    try {
      const filter = getNodeSearchFilter(input.query);

      const results = await prisma.node.findMany({
        where: filter,
        take: input.limit,
        skip: input.offset,
        orderBy: { nodeId: 'asc' }
      });

      return results;
    } catch (error) {
      console.error('[VR-010] Search Validation Failure:', error);
      throw new Error('Maximum sequence reached for Node. Contact administrator.');
    }
  }
}