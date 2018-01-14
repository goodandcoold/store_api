import AuthController from '../controllers/authController';
import UserController from '../controllers/userController';
// import ItemContoller from '../controllers/itemContoller';

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
];

export default routes;
