# Simple Twitter Search App

A rudementary Node.js application for searching Twitter and storing the result in a SQLite DB.

## Requirements

The main dependency is the Node Package Manager. Other depedencies can be installed by:

    npm install

## Configuration

Access credentials are required to use the Twitter API. These are read from the ./config.json JSON file. Make sure the file permisions restrict others from getting access to your keys/secrets!

You can enter [User access tokens](https://dev.twitter.com/oauth/overview/application-owner-access-tokens), eg:

    {
        "consumer_key": "your-key",
        "consumer_secret": "your-secret",
        "access_token_key": "your-token-key",
        "access_token_secret": "your-token-secret"
    }

Or [application-only tokens](https://dev.twitter.com/oauth/application-only), eg:

    {
        "consumer_key": "your-key",
        "consumer_secret": "your-secret",
        "bearer_token": "your-app-bearer-token"
    }

## Running a search

The query is currently hardcoded in app.js. Run with:

    node app.js
