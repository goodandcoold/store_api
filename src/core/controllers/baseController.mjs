import jwt from 'jsonwebtoken';

class BaseController {


  handleError(ctx, err) {
    let {status = 500, message, jsonMessage = null} = err;
    ctx.status = err.status || 500;
    ctx.body = jsonMessage !== null ? jsonMessage : {message};
    ctx.app.emit('error', err, ctx);
  }

  generateJsonError (errors) {
    return Object.keys(errors).reduce((jsonMessage, errKey) => {
      return { field : errKey, message : errors[errKey].message }
    }, {});
  }

  generateToken (user, role = 'user', secret) {
   const { _id: id, name, email } = user;

   return jwt.sign({ role, id, name, email }, secret);
  }
}

export default new BaseController();
