require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var ask = require("inquirer");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var option = process.argv[2];
var value = "";
// console.log(spotify);

doCommand();

function doCommand() {

    var questions = [

        {
            type:"list",
            name:"command",
            message:"How can I help you?",
            choices:[
                "Read Tweets",
                "Song Information",
                "Movie Information",
                "Do other stuff"
            ],
            validate: function(value) {
                if(value == "") {
                    console.log("Choose an option!");
                }
                
            }
        }

    ];

    ask.prompt(questions).then(function(inquirerResponse) {

        switch(inquirerResponse.command) {

            case "Read Tweets":

                readTweets();

                break;
            
            case "Song Information":

                getSongInformation();

                break;

            case "Movie Information":

                getMovieInformation();

                break;

            case "Do Other Stuff":

                doOtherStuff();

                break;



        }
        console.log();
        
      });

}

function readTweets() {

    var twitterQuestion = {

        type: "input",
        name: "user",
        message: "Please inform the Twitter username to retrieve his/her last 10 tweets.",
        default: function() {
            return "officialjaden";
          }
    };

    ask.prompt(twitterQuestion).then(function(response) {

        console.log("*******************************");
        console.log("Check it out the last 20 tweets from " +response.user+ ".");
        console.log("*******************************");

        twitter.get('statuses/user_timeline', {screen_name: response.user, count: 20, exclude_replies: true}, function(error, tweets, response) {
            if(error) throw error;
    
            for (var key in tweets) {
    
                // if (key == choice)
                console.log("-------------------------------------------------------------");
                console.log(tweets[key].created_at);
                console.log(tweets[key].text);
                console.log("-------------------------------------------------------------");
            }
    
            // console.log(JSON.stringify(tweets, null, 2));  // The favorites.
            // console.log(JSON.stringify(response, null, 2));  // Raw response object.
          });

    });

    

};

function getSongInformation() {

};

function getMovieInformation() {

};

function doOtherStuff() {

};

function log(information) {

}

