#!/usr/bin/env node

let environments = require('./util/environments');
let healthCli = require('./cli/health');

let yargs = require('yargs')
    .alias('v', 'version')
    .version(function() { return require('../package').version; })
    .describe('v', 'show version information')
    .command(require('./cli/ack.js'))
    .command(require('./cli/open-url.js'))
    .command(require('./cli/health.js'))
    .demand(1)
    .strict()
    .alias('help', 'h')
    .help('help')
    .argv;
