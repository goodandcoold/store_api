import * as fsDefault from "fs";
import * as utilDefault from "util";

const {readFile, writeFile, readFileSync} = fsDefault.default;
const util = utilDefault.default;
const readFilePromised = util.promisify(readFile);
const writeFilePromised = util.promisify(writeFile);
const contentType = 'application/json';
const dbFile = 'db.json';


let getMessages = async ctx => {
    ctx.status = 200;
    ctx.type = contentType;
    const buf = await readFilePromised(dbFile);
    let message = JSON.parse(buf.toString());
    ctx.body = message;
  },
  putMessages = async ctx => {
    const {message} = ctx.request.body;
    await writeFilePromised(dbFile, JSON.stringify({message}));
    const buf = await readFilePromised(dbFile);
    const newMessage = JSON.parse(buf.toString());
    ctx.status = 201;
    ctx.type = contentType;
    ctx.body = newMessage;
  };

  const routes = [
    { verb: 'get', path: '/messages', action: getMessages },
    { verb: 'put', path: '/messages', action: putMessages }
];

export default routes;
