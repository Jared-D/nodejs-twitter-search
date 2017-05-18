var Twitter = require('twitter');
var client_config = require('./config.json');
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('db.sqlite');

var client = new Twitter(client_config);

client.get('search/tweets', {q: '#liveperson'}, function(error, tweets, response) {
       console.log(tweets);
});

