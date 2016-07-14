'use strict'

let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

let environments = fs.readFileAsync(__dirname + '/../../env.json').then(function(data){
  return Promise.resolve(JSON.parse(data));
});

function multiFilter(filter){
  if (!filter){
    return environments;
  }

  var regex = parseRegex(filter);
  return environments.then(envs => {
    return envs.filter(function(elem){
      for (var i in regex){ // if any match
        if (regex[i].test(elem.name) || regex[i].test(elem.category)){
          return true;
        }
      }
    });
  });
}

function parseRegex(filter){
  var regex = [];
  if(Object.prototype.toString.call(filter) === '[object Array]'){
    regex = filter.map(i => new RegExp(i + '.*', 'i'));
  } else {
    regex.push(new RegExp(filter + '.*', 'i'));
  }
  return regex;
}

function nameOnlyFilter(filter){
  if (!filter){
    return environments;
  }

  var regex = parseRegex(filter);
  return environments.then(envs => {
    return envs.filter(function(elem){
      for (var i in regex){ // if any match
        if (regex[i].test(elem.name)){
          return true;
        }
      }
    });
  });
}

function strictFilter(filter){
  if (!filter){
    return environments;
  }

  var regex = new RegExp(filter, 'i');
  var results = environments.then(envs => {
    return envs.filter(e => {
      return regex.test(e.name) || regex.test(e.category);
    });
  });

  if (results.length === 0){
    var fuzzy = new RegExp(filter + '.*', 'i');
    var broadResults = environments.then(envs => {
      return envs.filter(e => {
        return fuzzy.test(e.name) || fuzzy.test(e.category);
      });
    });

    if (broadResults.length > 0){
      console.log('Error: No environments found match ' + filter + '! Did you mean ' + broadResults + '?');
    } else {
      console.log('Error: No environments found match ' + filter + '! Please be more specific.');
    }
  }

  return Promise.resolve(results);
}

module.exports = {
  get: environments,
  filter: multiFilter,
  nameOnlyFilter: nameOnlyFilter,
  strictFilter: strictFilter
}
