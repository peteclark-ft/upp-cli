#!/usr/bin/env node

let co = require('co');
let environments = require('./util/environments');

let healthCli = require('./cli/health');

let argv = require('yargs')
    .option('long', {
      alias: 'l',
      describe: 'Show the failing healthchecks alongside the environments.',
      'default': 'false',
      type: 'boolean'
    })
    .option('filter', {
      alias: 'f',
      describe: 'Filter the environments.',
      type: 'string'
    })
    .command(require('./cli/ack.js'))
    .command(require('./cli/open-url.js'))
    .help('help')
    .argv;

environments.filter(argv.filter).then(envs => {
  healthCli.long = argv.long;
  healthCli.health(envs);
});
