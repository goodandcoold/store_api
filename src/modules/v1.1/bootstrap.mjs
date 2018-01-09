export default class Bootstrap {
  constructor(config) {
    this.app = config.app;
    this.config = config;
  }


  run () {
    let {logger = null, routing = null, bodyParser = null, view = null, db = null} = this.config;
    this.setDbConnections(db);
    this.setBodyParser(bodyParser);
    this.setRouting(routing);

    this.app.on('error', (err, ctx) => {
      console.error({err, ctx});
    });

    this.app.listen(3000);
  }


  setDbConnections(db) {
      if (db) {
        let {mongodb = null, mysql = null} = db;
        if (mongodb) {
            let { cdn = null, connection = null } = mongodb;

            if (connection && cdn) {
              connection.connect(cdn, {useMongoClient: true});
              connection.connection.on('error', console.error);
            }
        }
      }
  }

  setRouting(routing) {
    if (routing) {
      this.app.use(
        routing.router.routes(),
        routing.router.allowedMethods()
      );

      this.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          ctx.status = err.status || 500;
          ctx.type = contentType;
          ctx.body = err;
          ctx.app.emit('error', err, ctx);
        }
      });

      routing.routes.map(route => this.setRoute(routing.router, route));
    }
  }

  setRoute(router, route) {
      router[route.verb](route.path, route.action);
  }

  setBodyParser(bodyParser) {
      if (bodyParser)
          this.app.use(bodyParser())
  }
}
