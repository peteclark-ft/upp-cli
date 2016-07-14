'use strict'

let sprintf = require('sprintf-js').sprintf;

function separator(prev){
  if (prev){
    console.log('');
  }
}

function category(category){
  console.log(sprintf('[%s]', category.toUpperCase()));
}

function short(health){
  if (health.critical){
    console.log(sprintf('%-40s %-64s %-20s %-20s', health.environment.name, '', 'CRITICAL', '🔥'));
  } else if (health.warning){
    console.log(sprintf('%-40s %-64s %-20s %-20s', health.environment.name, '', 'WARNING', '😷'));
  } else {
    console.log(sprintf('%-40s %-64s %-20s %-20s', health.environment.name, '', 'OK', '👍'));
  }
}

function long(health){
  short(health);
  health.rows.map(function(service){
    console.log(sprintf('%-2s - %-100s    %-20s', '', service.name, service.msg));
  });
}

module.exports = {
  short: short,
  long: long,
  category: category,
  separator: separator
}
