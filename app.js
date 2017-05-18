var Twitter = require('twitter');
var twitter_config = require('./config.json');
var sqlite3 = require('sqlite3').verbose();
const uuidV4 = require('uuid/v4');
var TwitterSearch = require('./lib/twittersearch');

// Create twitter client.
var twitter_client = new Twitter(twitter_config);

// Open Sqlite DB.
var db = new sqlite3.Database('db.sqlite');

// Query twitter and save result.
db.serialize(function() {
    init_db();
    search = new TwitterSearch(twitter_client, "#liveperson", save_tweet, save_search);
});


// Initialise DB schema if not already done.
function init_db() {
    db.run(
        "CREATE TABLE IF NOT EXISTS search ( "+
        "id TEXT PRIMARY KEY, "+
        "query TEXT, "+
        "min_id TEXT, "+
        "max_id TEXT, "+
        "time DATETIME)");
    db.run(
        "CREATE TABLE IF NOT EXISTS tweet ( "+
        "id TEXT PRIMARY KEY, "+
        "text TEXT, "+
        "created_at DATETIME, "+
        "user_id INTEGER, "+
        "raw_data TEXT)");
}

// Save search query to DB.
function save_search() {
    // Create and save a search record.
    db.run(
        "INSERT INTO search VALUES(?, ?, ?, ?, datetime(?))",
        [
            uuidV4(),
            this.query,
            this.min_id,
            this.max_id,
            this.start_time.toISOString()
        ]
    );
}

// Save tweet(status) to DB.
function save_tweet(tweet) {
    // Convert twitter date to Date object,
    // see http://programming.mvergel.com/2013/03/convert-twitters-createdat-to.html
    created_date = new Date(Date.parse(tweet.created_at.replace(/( \+)/, ' UTC$1')));
    // Save the tweet if it's not already present.
    db.run(
        "INSERT OR IGNORE INTO tweet VALUES(?, ?, datetime(?), ?, ?)",
        [
            tweet.id_str,
            tweet.text,
            created_date.toISOString(),
            tweet.user.id_str,
            JSON.stringify(tweet)
        ]
    );
}

