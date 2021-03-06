# Twitter Search

A simple Node.js class for searching Twitter over multiple result pages (requests).

## Requirements

The main dependency is the Node Package Manager. Other depedencies can be installed by:

    npm install

## Configuration

TwitterSearch requires 4 parameters:
* A twitter client object.
* A query string containing the terms to search for.
* A callabck function for processing tweets, called for each tweet.
* A callback function called when the search is finished.

## Running a search

Example:

	var Twitter = require('twitter');
	var TwitterSearch = require('twitter-search');


	// Create a twitter client.
	var twitter_client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	// Search twitter, query is taken from the first command line argument.
	search = new TwitterSearch(
		twitter_client,
		process.argv[2],
		output_tweet,
		output_search
	);

	// Output search query details.
	function output_search() {
		console.log("Search finished");
		console.log("  query: " + this.query);
		console.log("  min_id: " + this.min_id);
		console.log("  max_id: " + this.max_id);
		console.log("  search stop reason: " + this.finish_reason);
		console.log("  start_time: " + this.start_time.toISOString());
		console.log("  end_time: " + this.end_time.toISOString());
	}

	// Output tweet(status).
	function output_tweet(tweet) {
		// Convert twitter date to Date object,
		// see http://programming.mvergel.com/2013/03/convert-twitters-createdat-to.html
		created_date = new Date(Date.parse(tweet.created_at.replace(/( \+)/, ' UTC$1')));
		// Output some tweet details.
		console.log("Tweet " + tweet.id_str);
		console.log("  text: " + tweet.text);
		console.log("  date: " + created_date.toISOString());
		console.log("  user id: " + tweet.user.id_str);
	}


Run the example with:

    TWITTER_CONSUMER_KEY='...' \
    TWITTER_CONSUMER_SECRET='...' \
    TWITTER_ACCESS_TOKEN_KEY='...' \
    TWITTER_ACCESS_TOKEN_SECRET='...' \
    node example.js '#google'

