import * as dotEnvDefault from "dotenv";
import mongoose from "mongoose";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import routes from '../src/modules/v1.1/routes/routes';
import Koa from  "Koa";
import Bootstrap from '../src/modules/v1.1/bootstrap';
import * as fs from 'fs';

const {readFile, writeFile, readFileSync} = fs.default;


export default class Config {
  constructor (env, version) {
    this.env = env;
    this.version = version;
  }

  getConfigForVersion() {
    return this.config[this.version];
  }

  get config () {
    const {driver, host, database} = JSON.parse(readFileSync('database.json', 'utf8'))[this.env];
    const router = new Router({prefix: `/api/${this.version}`});

    return {
      "v1.1" : {
        app : new Koa(),
        bootstrap: Bootstrap,
        db: {
            mongodb: {
                connection: mongoose,
                cdn: `${driver}://${host}/${database}`
            }
        },
        routing: { router, routes },
        bodyParser: bodyParser
      }
    };
  }
};
