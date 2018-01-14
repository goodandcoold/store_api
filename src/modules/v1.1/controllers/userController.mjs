import User from '../models/user';
import BaseError from "../../../core/models/baseError";
import BaseController from "../../../core/controllers/baseController";


class UserController {

 async get(ctx) {

  try {
    let { id = null } = ctx.params;

    if (!id) throw new BaseError(401);

    const user = await User.findById(id);

    if (!user) throw new BaseError(422);

    ctx.body = User.getPublicProps(user);
  } catch (err) {
    BaseController.handleError(ctx, err);
  }
  }

  async find(ctx) {
    try {
      ctx.body = await User.findUsers(ctx.query);
      ctx.status = 200;
    } catch (err) {
      BaseController.handleError(ctx, err);
    }

  }

  // async delete(ctx) {
  //   try {
  //     const user = await User.findByIdAndRemove(ctx.state.user.id);
  //     if (!user) {
  //       ctx.throw(404);
  //     }
  //     ctx.body = user;
  //   } catch (err) {
  //     if (err.name === 'CastError' || err.name === 'NotFoundError') {
  //       ctx.throw(404);
  //     }
  //     ctx.throw(500);
  //   }
  // }
}


export default new UserController();
