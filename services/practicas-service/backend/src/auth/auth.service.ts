import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(profileId: string) {
    const profile = await this.prisma.profiles.findUnique({
      where: { id: profileId },
      include: {
        roles: true,
      },
    });

    if (!profile) {
      return { message: 'Profile not found' };
    }

    return profile;
  }
}
