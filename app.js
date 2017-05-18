var Twitter = require('twitter');
var twitter_config = require('./config.json');
var sqlite3 = require('sqlite3').verbose();
const uuidV4 = require('uuid/v4');

// Create twitter client.
var twitter_client = new Twitter(twitter_config);

// Open Sqlite DB.
var db = new sqlite3.Database('db.sqlite');

// Query twitter and save result.
twitter_client.get('search/tweets', {q: '#liveperson'}, function(error, tweets, response) {
    db.serialize(function() {
        init_db();
        save_search(tweets);
    });
});

// Initialise DB if not already done.
function init_db() {
    db.run(
        "CREATE TABLE IF NOT EXISTS search ( "+
        "id TEXT PRIMARY KEY, "+
        "query TEXT, "+
        "max_id INTEGER, "+
        "time DATETIME, "+
        "raw_data TEXT)");
    db.run(
        "CREATE TABLE IF NOT EXISTS tweet ( "+
        "id INTEGER PRIMARY KEY, "+
        "text TEXT, "+
        "created_at DATETIME, "+
        "user_id INTEGER)");
}

// Save search query and results to DB.
function save_search(search_result) {
    // Check data is present.
    if(!("statuses" in search_result)) {
        throw new Error("'statuses' key missing from result");
    }
    if(!("search_metadata" in search_result)) {
        throw new Error("'search_metadata' key missing from result");
    }
    // Create and save a search record.
    var search_record = {
        "id": uuidV4(),
        "query": search_result.search_metadata.query,
        "max_id": search_result.search_metadata.max_id,
        "time": new Date("now"),
        "raw": search_result
    };
    db.run(
        "INSERT INTO search VALUES(?, ?, ?, ?, ?)",
        [
            search_record.id,
            search_record.query,
            search_record.max_id,
            search_record.time.toISOString(),
            JSON.stringify(search_record.raw)
        ]
    );
    // Save result tweets.
    var statuses = search_result.statuses;
    for(i in statuses) {
        save_status(statuses[i]);
    }
}

// Save Status to DB.
function save_status(search_id, search_result) {
    // Convert twitter date to Date object,
    // see http://programming.mvergel.com/2013/03/convert-twitters-createdat-to.html
//    created_date = new Date(Date.parse(search_result.created_at.replace(/( \+)/, ' UTC$1')));
//    created_date.toISOString();
    console.log(search_result.id);
//    db.run("INSERT INTO tweet ()");
}
