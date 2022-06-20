import {Response} from 'express';
import * as utils from './utilities/util.js';

export async function getPassword(query: any, res: Response): Promise<Response<any, Record<string, any>>> {
    return res.json(JSON.parse(`{"${query.for}" : "${utils.format(await utils.encode(utils.getRandom()))}"}`));
}

