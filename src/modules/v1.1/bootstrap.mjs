
export default class Bootstrap {
  constructor(config) {
    this.config = config;
  }


  run () {
    let {
      logger = null,
      routing = null,
      bodyParser = null,
      view = null,
      db = null
    } = this.config;

    this.setDbConnections(db);
    this.setBodyParser(bodyParser);
    this.setRouting(routing);

    this.config.app.on('error', (err, ctx) => console.error({err, ctx}));

    this.config.app.listen(3000);
  }


  setDbConnections(db) {
      if (db) {
        let { mongodb = null, mysql = null } = db;

        if (mongodb) {
            let { cdn = null, connection = null } = mongodb;

            if (connection && cdn)
              connection.connect(cdn, {useMongoClient: true});
              connection.connection.on('error', console.error);
        }
      }
  }

  setRouting(routing) {
    if (routing) {
      const { secret } = routing;
      const jwt = routing.jwt({ secret });

      routing.routes.forEach(route => {
        let { prefix, endpoints } = route,
            router = new routing.routerClass ({ prefix });

            endpoints.forEach(endpoint => {
              let {verb, path, action, access = false} = endpoint,
                  methods = access
                    ? [ path, action ]
                    : [ path, jwt, action ];

                router[verb](...methods);
            });

            this.config.app.use(
              router.routes(),
              router.allowedMethods()
            );
      });
    }
  }

  setBodyParser(bodyParser) {
      if (bodyParser)
          this.config.app.use(bodyParser())
  }
}
