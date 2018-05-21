require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var ask = require("inquirer");
var moment = require('moment');
var fs = require("fs");
var request = require("request");

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
                "Do Other Stuff"
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
        // console.log();
        
      });

}

function readTweets() {

    var functionName = "readTweets";
    var time = moment().format('LLLL');

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
    
          });

        log(time, functionName, response.user);

    });

    

};

function getSongInformation() {

    var functionName = "songInformation";
    var time = moment().format('LLLL');

    var songQuestion = {

        type: "input",
        name: "songName",
        message: "Please inform the song title.",
        default: function() {
            return "The sign";
          }
    };

    ask.prompt(songQuestion).then(function(song) {

        spotify.search({ type: 'track', query: song.songName, limit: 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }

            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            console.log("Band: "+data.tracks.items[0].artists[0].name); 
            console.log("Song Name: "+data.tracks.items[0].name);
            console.log("Link to the song on Spotify: "+data.tracks.items[0].external_urls.spotify);
            console.log("Album: "+data.tracks.items[0].album.name);
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

            log(time, functionName, song.songName);

          });

    });

};

function getMovieInformation() {

    var functionName = "movieInformation";
    var time = moment().format('LLLL');

    var movieQuestion = {

        type: "input",
        name: "movieName",
        message: "Please inform the movie name.",
        default: function() {
            return "Mr. Nobody.";
          }
    };

    ask.prompt(movieQuestion).then(function(response) {

        var movieNameQuery = convertMovieNameToOmdb(response.movieName);

        request("http://www.omdbapi.com/?t="+movieNameQuery+"&y=&plot=short&apikey=trilogy", function(error, resp, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && resp.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
                console.log("Movie title: "+JSON.parse(body).Title);
                console.log("Released on : "+JSON.parse(body).Released);
                console.log("IMDB rating: "+JSON.parse(body).Ratings[0].Value);
                console.log("Rotten Tomatoes rating: "+JSON.parse(body).Ratings[1].Value);
                console.log("Country: "+JSON.parse(body).Country);
                console.log("Language: "+JSON.parse(body).Language);
                console.log("Plot: "+JSON.parse(body).Plot);
                console.log("Cast: "+JSON.parse(body).Actors);
                console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
                
                var time = moment().format('LLLL');

                log(time, functionName, response.movieName);
                
            }
        });

        

    });

};

function doOtherStuff() {

    var content = "";

    fs.readFile('random.txt', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        
        content = data;

        var functionName = "doSomethingElse";
        var time = moment().format('LLLL');

        spotify.search({ type: 'track', query: content, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
            console.log("Band: "+data.tracks.items[0].artists[0].name); 
            console.log("Song Name: "+data.tracks.items[0].name);
            console.log("Link to the song on Spotify: "+data.tracks.items[0].external_urls.spotify);
            console.log("Album: "+data.tracks.items[0].album.name);
            console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

            log(time, functionName, content);

        });

    });

    

};

function log(timeLog, functionLog, valueLog) {

    var content = "LOG: " +timeLog+ ", ||| Selected option - " +functionLog+ " ||| value used - " +valueLog +"\n";

    fs.appendFile("log.txt", content, function(err) {

        // If an error was experienced we say it.
        if (err) {
          console.log(err);
        }
      
        else {;
        }
      
      });


}

function convertMovieNameToOmdb(movieName) {

    var movieArray = movieName.split(" ");
    var result = "";

    for (let index = 0; index < movieArray.length; index++) {
        
        if(index == movieArray.length-1) {

            result += movieArray[index];

        } else {

            result += movieArray[index]+"+";

        }
        
    
    }
    
    return result;


}

