/**
 * Search Twitter and process the results.
 *
 * Encapsulates a search done over multiple requests (result pages).
 *
 * @param client        A twitter client object.
 * @param query         Query terms to search for.
 * @param process_tweet Callabck for processing tweets, called for each tweet.
 * @param done          Callback called when search is finished.
 */
function TwitterSearch(client, query, process_tweet, done) {
    this.client = client;
    this.query = query;
    this.page_size = 100;
    this.request_count = 0;
    this.request_limit = 15;
    this.min_id = null;
    this.max_id = null;
    this.start_time = new Date();
    // Callabck for processing tweets, called for each tweet.
    this.process_tweet = process_tweet;
    // Callback called when search is finished.
    this.done = done;

    this._search();
}

// Recursivly fetch search results.
// For info on iterating Twitter search results see 
//   https://dev.twitter.com/rest/public/timelines
TwitterSearch.prototype._search = function() {
    var id_size = 20; //number of digits in a 64bit int
    // Keep a reference for use in callbacks.
    var search_ob = this;
    // Stop if request limit has been reached.
    if(search_ob.request_count >= search_ob.request_limit) {
        search_ob._done("request limit reached");
        return;
    }
    // Send the search request.
    var params = {q: search_ob.query, count:search_ob.page_size};
    if(search_ob.min_id !== null) params.max_id = search_ob.min_id;
    // TODO params.max_id should actually be (search_ob.min_id - 1) but a lack of 
    // 64bit integer support makes this difficult.
    search_ob.client.get('search/tweets', params, function(error, tweets, response) {
        search_ob.request_count++;
        // Abort on error.
        if(error) throw error;
        // Check the expected data is present in result.
        if(!("statuses" in tweets)) {
            throw new Error("'statuses' key missing from result");
        }
        if(!("search_metadata" in tweets)) {
            throw new Error("'search_metadata' key missing from result");
        }
        // Remove already processed tweet (only for when params.max_id is off by one).
        if(search_ob.min_id !== null) {
            tweets.statuses = tweets.statuses.filter(function(tweet){
                var padded_id = search_ob._leftpad(tweet.id_str, id_size);
                return padded_id !== search_ob.min_id;
            });
        }
        // Check for empty result.
        if(tweets.statuses.length <= 0) {
            search_ob._done("no more results");
            return;
        }
        // Process each tweet.
        var min_id = search_ob.min_id;
        var max_id = search_ob.max_id;
        for(var i in tweets.statuses) {
            // Update min and max IDs.
            var padded_id = search_ob._leftpad(tweets.statuses[i].id_str, id_size);
            if(min_id === null || padded_id < min_id) min_id = padded_id;
            if(max_id === null || padded_id > max_id) max_id = padded_id;
            // Execute callabck.
            search_ob.process_tweet(tweets.statuses[i]);
        }
        search_ob.min_id = min_id;
        search_ob.max_id = max_id;
        // Recursivly call _search until finished.
        search_ob._search(search_ob);
    });
}

TwitterSearch.prototype._done = function(reason) {
    this.end_time = new Date();
    this.finish_reason = reason;
    this.done();
}

// Pad the given string with zeros up to the specified length.
// Based on http://stackoverflow.com/a/13859571
TwitterSearch.prototype._leftpad = function(value, length) {
    return (value.toString().length < length) ? this._leftpad("0"+value, length):value;
}

module.exports = TwitterSearch;
