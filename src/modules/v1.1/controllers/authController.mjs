import User from '../models/user';
import * as dotenv from "dotenv";
import BaseError from "../../../core/models/baseError";
import BaseController from "../../../core/controllers/baseController";

const {SECRET} = dotenv.default.config().parsed;

class AuthController {

 async register(ctx) {
   try {
     const user = await new User(ctx.request.body)
       .save()
       .catch(err => {
        let errorJson = (err.name == 'MongoError')
          ? {field: "email", message: "Email must be unique"}
          : BaseController.generateJsonError(err.errors);

         throw new BaseError(422, "", errorJson);
       });

       ctx.status = 201;
       ctx.body = { token: BaseController.generateToken(user, 'user', SECRET) };
   } catch (err) {
     BaseController.handleError(ctx, err)
   }
  }

  async login(ctx) {
   try {
     const { email, password } = ctx.request.body;
     const user = await User.findOne({ email, password });
     if (!user)
       throw new BaseError(422, "", {
         field: 'password', message: 'Wrong email or password'
       });

     ctx.status = 200;
     ctx.body = { token: BaseController.generateToken(user, 'user', SECRET) };
   } catch (err) {
       BaseController.handleError(ctx, err);
   }
  }

  async me(ctx) {
   try {
     let { id = null } = ctx.state.user;

     if (!id) throw new BaseError(401);

     const user = await User.findById(id);

     if (!user) throw new BaseError(422);

     ctx.body = User.getPublicProps(user);
   } catch (err) {
     BaseController.handleError(ctx, err);
   }
  }

  async update(ctx) {
   try {
     const user = await User.findByIdAndUpdate(
       ctx.state.user.id, ctx.request.body
     );

     if (!user) throw new BaseError(422);

     ctx.body = user;
   } catch (err) {
     BaseController.handleError(ctx, err);
   }
  }

}


export default new AuthController();
