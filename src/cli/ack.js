'use strict'

let environments = require('../util/environments');
let healthchecks = require('../http/healthchecks');
let exec = require('child_process').exec;

function ack(environment, service, message){
  console.log('Adding acknowledgement for \"'+service.name+'\" in environment \"'+environment.name+'\"');
  exec("ssh -t " + environment.tunnel + " 'etcdctl set /ft/healthcheck/" + service.name + "/ack' " + message);
}

function deleteAck(environment, service){
  console.log('Removing acknowledgement for \"'+service.name+'\" in environment \"'+environment.name+'\"');
  exec("ssh -t " + environment.tunnel + " 'etcdctl rm /ft/healthcheck/" + service.name + "/ack' ");
}

function processAcks(process, environment, service, message){
  var serviceRegex = new RegExp(service, 'i');
  environments.nameOnlyFilter(environment).then(data => {
    data.forEach(env => {
      healthchecks.health(env).then(result => {
        var services = result.rows.filter(row => {
          return serviceRegex.test(row.name);
        });

        if (services.length === 0){
          console.log('Warning: No matching UNHEALTHY services found for matching environment \"' + env.name + '\".');
          return;
        }

        services.forEach(s => process(env, s, message));
      });
    });
  });
}

exports.command = 'ack <environment> <service>'
exports.describe = 'Acknowledge a healthcheck for a service in an environment. Requires environment(s), and service(s) to acknowledge - both arguments can be regular expressions for multi select.'
exports.builder = {
  message: {
    alias: 'm',
    type: 'string',
    describe: 'The reason why you want to acknowledge this warning - please also provide initials for auditing.'
  },
  delete: {
    alias: 'd',
    type: 'boolean',
    describe: 'Delete the matching acknowledgements.'
  }
};

exports.handler = function (argv){
  if (argv.delete){
    processAcks(deleteAck, argv.environment, argv.service, argv.message);
  } else if (!argv.message){
    console.log('Error: Please specify a message.');
  } else {
    processAcks(ack, argv.environment, argv.service, argv.message);
  }
}
