import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    sub: string;
    name: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        role: string;
    };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const [, token] = authHeader.split(' ');


    if (!token) {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET não configurado.');

        const decoded = jwt.verify(token, secret) as unknown as TokenPayload;

        req.user = {
            id: decoded.sub,
            name: decoded.name,
            role: decoded.role,
        };

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}