/* jshint node: true */
'use strict';

const throng = require('throng');

const WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start);

function start() {
  require('./server');
}
