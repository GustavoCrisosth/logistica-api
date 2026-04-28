import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'DRIVER';
}

export class UserService {
    async execute({ name, email, password, role }: CreateUserDTO) {
        // 1. Verifica se o e-mail já está em uso
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            throw new Error('E-mail já cadastrado.');
        }

        const password_hash = await bcrypt.hash(password, 8);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                role: role || 'DRIVER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        return user;
    }
}