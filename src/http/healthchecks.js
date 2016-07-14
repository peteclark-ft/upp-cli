'use strict'

let cheerio = require('cheerio');
let request = require('request-promise');

function health(environment){
  return request({
    uri: environment.url,
    transform: function(body){
      let $ = cheerio.load(body);
      var results = {
        environment: environment
      };

      let rows = $('tr').filter(function(i, el){
        var html = $(this).find('span').html();
        if (html === 'CRITICAL'){
          results.critical = true;
          return true;
        } else if (html === 'WARNING'){
          results.warning = true;
          return true;
        }

        return html.indexOf('ACKED') > -1;
      }).map(function(){
        let j = $(this);
        let a = j.find('a');
        let span = j.find('span');
        return {
          name: a.html(),
          url: a.attr('href'),
          msg: span.html()
        };
      }).get();

      results.rows = rows;
      return results;
    }
  });
}

module.exports = {
  health: health
}
