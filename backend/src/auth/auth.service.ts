import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../data/repositories/users.repository';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async validateOAuthUser(profile: {
        provider: string;
        providerId: string;
        email: string;
        name?: string;
    }) {
        // Find or create user
        const user = await this.usersRepository.findOrCreate(profile);
        return user;
    }

    async generateJwtToken(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
