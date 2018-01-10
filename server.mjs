import Application from './src/core/application';
import Config from './config/config';
import * as dotenv from "dotenv";

const {ENV, API_VER, SECRET} = dotenv.default.config().parsed;

Application.run (new Config(ENV, API_VER, SECRET).getConfigForVersion());
