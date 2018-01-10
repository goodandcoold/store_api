
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
      const jwt = routing.jwt({
        secret: routing.secret
      });

      this.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          ctx.status = err.status || 500;
          ctx.type = 'application/json';
          ctx.body = err;
          ctx.app.emit('error', err, ctx);
        }
      });

      routing.routes.forEach(route => {
        let {prefix, endpoints} = route,
            router = new routing.router ({prefix});

            endpoints.forEach(endpoint => {
              let {verb, path, action, access = false} = endpoint;
              if (access) {
                router[verb](path, action);
              } else {
                router[verb](path, jwt, action);
              }

            })

            this.app.use(
              router.routes(),
              router.allowedMethods()
            );
      });
    }
  }

  setBodyParser(bodyParser) {
      if (bodyParser)
          this.app.use(bodyParser())
  }
}
