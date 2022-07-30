import express from 'express';
import env from './utilities/Global.js';
import * as utils from './utilities/util.js';
import * as services from './service.js';
import * as responses from './default_responses/responses.js';

const app = express();
app.use(express.json());

app.listen(3000, () => env.setKey());

/**
 * Testing endpoint.
 */
app.get('/test', async (req: express.Request, res: express.Response) => {
    let p = utils.hash(utils.getRandom());
    res.send({ 'res': utils.format(await p) });
})

/**
 * Default entry point. Requires key as header, fails on invalid key or missing key.
 * Returns a list of objects for the provided parameters 'from' and 'with', representing
 * the site and the account name, respectively. It will return an empty object in case any of the
 * supplied parameters' lenght is less that 3, to prevent the return of the whole list of credentials.
 * It will also fail on empty filters. The returned password will be encrypted, so the receiver/client
 * side app must decrypt the actual password... although you might just use that as it is. not recommended tho
 */
app.get('/get', async (req: express.Request, res: express.Response) => 
    proceed(res, checkValidHeaders(req.headers), services.getResponse, req.query, res)
)

/**
 * Creates new credential holder for the given site and account name passed in the body. Will fail
 * in case any of the fields is shorteer than 3, empty or missing. It will check for duplicates, with a
 * different status. I don't know if it should retrieve the original record. 
 * For a new record, it will respond with the new card, including encrypted password.
 */
app.post('/new', async (req: express.Request, res: express.Response) => 
    proceed(res, checkValidHeaders(req.headers), services.newAccount, req.body, res)
)

/**
 * Saves lines for what might the most common operation 
 * @param res express Response
 * @param onErrorFuncton the returned operation to perform in case headers are not valid
 * @param onSucessFunction the CRUD operation to run if validation succeeds
 * @param params parameters for the onSucessFunction to run AND THE RESPONSE
 */
function proceed(res: express.Response, onErrorFuncton: Function | undefined, onSucessFunction: Function, ...params: any) {
    if (onErrorFuncton === undefined)
        onSucessFunction.apply(null, params);
    else 
        onErrorFuncton.apply(res)
}

/**
 * This is defined to reuse the same validation. Checks that the requiered headers are there and that they are
 * valid.
 * @param headers headers of the http request
 * @returns the function in case any validation fails
 */
function checkValidHeaders(headers: any): Function | undefined {
    if (headers.origin !== undefined) {
        if (headers.origin.toString() !== 'test') {
            return responses.invalidToken;
        }
        return;
    }
    return responses.badRequest;
}
