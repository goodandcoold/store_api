import * as fsDefault from "fs";
import * as utilDefault from "util";
import AuthController from '../controllers/authController';
import UserController from '../controllers/userController';
// import ItemContoller from '../controllers/itemContoller';

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
  {
    prefix: "/api",
    endpoints: [
      { verb: "post", path: "/login", action: AuthController.login, access: true },
      { verb: "post", path: "/register", action: AuthController.register, access: true },
      { verb: "get", path: "/me", action: AuthController.me },
      { verb: "put", path: "/me", action: AuthController.update }
    ]
  },
  {
    prefix: "/api/user",
    endpoints: [
      { verb: "put", path: "/", action : UserController.add },
      { verb: "get", path: "/:id", action : UserController.get },
      { verb: "get", path: "/", action : UserController.find },
    ]
  },
  // {
  //   prefix: "/api/item",
  //   endpoints: [
  //     { verb: "get", path: "/", action: ItemController.find },
  //     { verb: "get", path: "/:id", action : ItemController.get },
  //     { verb: "put", path: "/", action : ItemController.add },
  //     { verb: "delete", path: "/:id", action : ItemController.delete },
  //     { verb: "put", path: "/:id", action : ItemController.update },
  //     { verb: "post", path: "/:id/image", action : ItemController.updateImage },
  //     { verb: "delete", path: "/:id/image", action : ItemController.deleteImage },
  //   ]
  // },
  {
    prefix: "/api/v1.1",
    endpoints: [
      { verb: 'get', path: '/messages', action: getMessages },
      { verb: 'put', path: '/messages', action: putMessages },
    ]
  }
];

export default routes;
