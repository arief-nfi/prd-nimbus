import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  async getProjectSummary(userId: string) {
    const [userCount, activeSessions] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({ where: { expiresAt: { gt: new Date() } } })
    ]);

    // In a real application, these metrics would be derived from complex business logic
    return {
      totalUsers: userCount,
      activeSessions: activeSessions,
      systemHealth: 98.5,
      revenue: 12450.00,
      lastUpdated: new Date().toISOString()
    };
  }
}