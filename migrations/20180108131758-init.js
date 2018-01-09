'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
   db.createCollection('user', callback);
   db.createCollection('product', callback);

   return true;
};

exports.down = function(db, callback) {
  db.dropCollection('user', callback);
  db.dropCollection('product', callback);
};

exports._meta = {
  "version": 1
};
