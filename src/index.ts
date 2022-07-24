import express from 'express';
import * as utils from './utilities/util.js';
import * as services from './service.js';
import * as responses from './default_responses/responses.js';

const app = express();
app.use(express.json());

app.listen(3000, () => { console.log('listening on port 3000'); });

/**
 * Testing endpoint.
 */
app.get('/test', async (req: express.Request, res: express.Response) => {
    let p = utils.encode(utils.getRandom());
    res.send({ 'res': utils.format(await p) });
})

app.get('/get', async (req: express.Request, res: express.Response) => {
    let param = req.query;
    let headers = req.headers;
    if (headers.origin !== undefined) {
        if (headers.origin.toString() !== 'test') {
            responses.invalidToken(res);
        } else {
            // if (param.with === undefined) 
            services.getResponse(param, res);
            // else services.getPassword(param, res);
        }
    } else {
        responses.badRequest(res);
    }
});

app.post('/new', async (req: express.Request, res: express.Response) => {
    let headers = req.headers;
    if (headers.origin !== undefined) {
        if (headers.origin.toString() !== 'test') {
            responses.invalidToken(res);
        } else {
            services.newAccount(req.body, res);
        }
    } else {
        responses.badRequest(res);
    }
})