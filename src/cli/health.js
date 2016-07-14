'use strict'

let Promise = require('bluebird');
let healthchecks = require('../http/healthchecks');
let formatting = require('./formatting');

function processEnvironments(environments){
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

      if (module.exports.long){
        formatting.long(a);
        return;
      }

      formatting.short(a);
    });
  }).catch(function(err){
    console.log(err);
  });
}

module.exports = {
  health: processEnvironments,
  long: false
}
