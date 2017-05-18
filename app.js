var Twitter = require('twitter');
var twitter_config = require('./config.json');
var sqlite3 = require('sqlite3').verbose();

// Create twitter client.
var twitter_client = new Twitter(twitter_config);

// Open Sqlite DB.
var db = new sqlite3.Database('db.sqlite');

// Query twitter.
twitter_client.get('search/tweets', {q: '#liveperson'}, function(error, tweets, response) {
//    console.log(tweets);
    if(!("statuses" in tweets)) {
        throw new Error("'statuses' key missing from result");
    }
    db.serialize(function() {
        init_db();
        var statuses = tweets.statuses;
        for(i in statuses) {
            save_status(statuses[i]);
        }
    });
});

// Initialise DB if not already done.
function init_db() {
//    db.run("CREATE TABLE IF NOT EXISTS tweets (id INTEGER PRIMARY KEY, text TEXT)");
}

// Save Status to DB.
function save_status(data) {
    // Convert twitter date to Date object,
    // see http://programming.mvergel.com/2013/03/convert-twitters-createdat-to.html
//    created_date = new Date(Date.parse(data.created_at.replace(/( \+)/, ' UTC$1')));
//    created_date.toISOString();
    console.log(data.id);
//    db.run("INSERT INTO tweets ()");
}
