import {Response} from 'express';

export function invalidToken(res: Response): Response {
    return res.status(403).json('Invalid token');
}

export function badRequest(res: Response): Response {
    return res.status(400).json('Bad request')
}