import bcrypt from 'bcrypt';
import aes from 'crypto-js/aes.js';
import env from './Global.js';
import { randomInt, randomBytes } from 'crypto';

const rounds = 12;
const aux = ["?", randomInt(6, 10).toString(), "&", "*", "<", "$", "#", ">", "!", randomInt(0, 6).toString()];

export function format(src: string): string {
    let formated: string = "";
    let sublength: number = src.substring(6).length;
    let currRandom: number = 0;
    for (let i = 0; i != sublength; i += 2) {
        if (randomInt(0, 20) >= 10) {
            let tran = randomInt(0, 10); 
            while (tran == currRandom) {
                tran = randomInt(0, 10);
            }
            currRandom = tran;
            formated += aux[currRandom];
        } else {
            formated += src.substring(6).charAt(i);
        }
    }
    return formated;
}

export async function hash(pass: string) {
    return await bcrypt.hash(pass, rounds);
}

export function getRandom(): string {
    let res: string = randomBytes(16).toString();
    return res;
}

export async function generate(): Promise<string> {
    return format(await hash(getRandom()));
}

export async function encode(hashed: string): Promise<String> {
    return aes.encrypt(hashed, env.getKey()).toString();
}

export async function decode(encripted: string): Promise<String> {
    return aes.decrypt(encripted, env.getKey()).toString();
}