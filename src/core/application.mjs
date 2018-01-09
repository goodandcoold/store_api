export default class Application {
  static run (config) {
    new config.bootstrap(config).run();
  }
}
