'use strict'

let Promise = require('bluebird');
let healthchecks = require('../http/healthchecks');
let envs = require('../util/environments');
let formatting = require('./formatting');

function processEnvironments(environments, longFormat){
  var promises = [];
  environments.map(function(env){
    promises.push(healthchecks.health(env));
  });

  Promise.all(promises).then(function(data){
    var lastCategory;
    data.sort(function(a, b){
      return a.environment.importance > b.environment.importance;
    })
    .forEach(function(a){
      if (!lastCategory || lastCategory !== a.environment.category){
        formatting.separator(lastCategory);
        formatting.category(a.environment.category);
        lastCategory = a.environment.category;
      }

      if (longFormat){
        formatting.long(a);
        return;
      }

      formatting.short(a);
    });
  }).catch(function(err){
    console.log(err);
  });
}

exports.command = 'health'
exports.describe = 'Show healthcheck information.'

exports.builder = {
  long: {
    alias: 'l',
    describe: 'Show the failing healthchecks alongside the environments.',
    'default': 'false',
    type: 'boolean'
  },
  filter: {
    alias: 'f',
    describe: 'Filter the environments.',
    type: 'string'
  }
};

exports.handler = function (argv){
  envs.filter(argv.filter).then(result => {
    processEnvironments(result, argv.long);
  });
}
