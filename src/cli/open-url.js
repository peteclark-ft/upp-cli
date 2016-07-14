'use strict'

let environments = require('../util/environments');
let exec = require('child_process').exec;

function open(selection){
  environments.filter(selection)
    .then(data => {
      if (data.length === 0){
        console.log('Error: No environments match your input!');
        return;
      }

      data.forEach(e => {
        exec('open ' + e.url);
      });
    });
}

exports.command = 'open <environment>'
exports.describe = 'Open the aggregate health check page for the given environment. Accepts partial names for environments.'

exports.handler = function (argv){
  open(argv.environment);
}
