import express from 'express';
import { Tedis } from 'tedis';
import { getRandom, encode, format } from './util.js';

const app = express();
app.use(express.json());
// const tedis = new Tedis();

app.listen(3000, () => { console.log('listening on port 3000'); });

// http://localhost:3000/test
app.get('/test', async (req, res) => {
    let p = encode(getRandom());
    res.send({ 'res': format(await p) });
})

app.post('/get', async (req, res) => {
    let p = req.body;
    if (p !== undefined && p.toString().length > 0) {
        if (p.tkn !== 'testing') {
            res.status(403).json('Invalid token');
            return;
        } else {
            res.json(JSON.parse(`{"${p.qry}" : "${format(await encode(getRandom()))}"}`));
        }
    } else {
        res.status(400).json('Bad request')
    }
});

// await tedis.get("asdf").catch(() => console.log('rejected'));
// let result = await tedis.get('random');
// console.log(result);
// console.log(await tedis.exists('qwerty'));