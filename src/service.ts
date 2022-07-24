import {Response} from 'express';
import * as utils from './utilities/util.js';
import Holder from './utilities/Holder.js'
import * as responses from './default_responses/responses.js'

let dict: Array<Holder> = [new Holder('github','myAccount','4gh'), 
                           new Holder('gitlab','myWorkAccount','4gl'), 
                           new Holder('stackoverflow','mySadRep','4so'), 
                           new Holder('spotify','beats','4spty'), 
                           new Holder('reddit','kittenPicture007','4rdd')];

export async function getPassword(query: any, res: Response): Promise<Response<any, Record<string, any>>> {
    return res.json(JSON.parse(`{'${query.for}' : '${utils.format(await utils.encode(utils.getRandom()))}'}`));
}

export async function getResponse(query: any, res: Response): Promise<Response<any, Record<string, any>>> {
    return res.json(mapper(query));
}

export async function newAccount(body: any, res: Response): Promise<Response<any, Record<string, any>>> {
    if ((body.site === undefined || body.site.length < 3) || (body.acc === undefined || body.acc.length < 3)) {
        return responses.badRequest(res);
    }
    let t: Holder = new Holder(body.site, body.acc, await utils.generate());
    dict.push(t);
    return res.json(JSON.parse(JSON.stringify(t)));
}

function mapper(query: any): any {
    return JSON.parse(querySimulator(query.for, query.with));
}

function querySimulator(refSite?: String, refAcc?: String): string {
    if ((refSite === undefined || refSite.length < 3) && (refAcc === undefined || refAcc.length < 3)) return "{}";
    return JSON.stringify(dict.filter(element => refSite === undefined ? true : element.site.toLowerCase().includes(refSite.toLowerCase()))
                              .filter(element => refAcc === undefined ? true : element.acc.toLowerCase().includes(refAcc.toLowerCase())));
}

