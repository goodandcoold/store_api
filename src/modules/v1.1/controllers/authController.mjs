import User from '../models/user';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

const {SECRET} = dotenv.default.config().parsed;


class AuthController {


  async register(ctx) {
   try {
     const user = await new User(ctx.request.body).save();
     ctx.status = 201;
     ctx.body = user;
   } catch (err) {
     ctx.throw(422);
   }
 }

 async login(ctx) {
   try {
     const user = await User.find({password : ctx.request.body.password})
     if (user) {
       ctx.status = 200;
       ctx.body = {
         token: jwt.sign(
           {
             role: 'admin'
           },
           SECRET
         ), // Store this key in an environment variable
         message: 'Successful Authentication'
       };
     } else {
       ctx.status = 401;
       ctx.body = {
         message: 'Authentication Failed'
       };
     }
   } catch (err) {
     if (err.name === 'CastError' || err.name === 'NotFoundError') {
       ctx.throw(404);
     }
     ctx.throw(500);
   }
 }

 async me(ctx) {
   try {
     const user = await new Promise ((resolve) => {
       resolve({"name" : "Alex"});
     });

     ctx.body = user;

   }catch (err) {

   }
 }

 async update(ctx) {
   try {
     const user = await User.findByIdAndUpdate(
       ctx.params.id,
       ctx.request.body
     );
     if (!user) {
       ctx.throw(404);
     }
     ctx.body = user;
   } catch (err) {
     if (err.name === 'CastError' || err.name === 'NotFoundError') {
       ctx.throw(404);
     }
     ctx.throw(500);
   }
 }
}


export default new AuthController();
