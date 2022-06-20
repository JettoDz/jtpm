import bcrypt from 'bcrypt';
import { randomInt, randomBytes } from 'crypto';

const rounds = 12;
const aux = ["?", randomInt(6, 10).toString(), "&", "*", "<", "$", "#", ">", "!", randomInt(0, 6).toString()];

export function format(src: string): string {
    let formated: string = "";
    let sublength: number = src.substring(6).length;
    let curr_random: number = 0;
    for (let i = 0; i != sublength; i += 2) {
        if (randomInt(0, 20) >= 10) {
            let tran = randomInt(0, 10);
            while (tran == curr_random) {
                tran = randomInt(0, 10);
            }
            curr_random = tran;
            formated += aux[curr_random];
        } else {
            formated += src.substring(6).charAt(i);
        }
    }
    return formated;
}

export async function encode(pass: string) {
    return await bcrypt.hash(pass, rounds);
}

export function getRandom(): string {
    let res: string = randomBytes(16).toString();
    return res;
}