/* Author: https://github.com/weilannw
 *
 * This testing module follows the terms described
 * in Twitter's Developer Agreement and Policy
 */
var fs = require('fs');
var sentiment = require('../sentiment');
var pstream = fs.createReadStream('./twitter_samples/positive_tweets.json');
var nstream = fs.createReadStream('./twitter_samples/negative_tweets.json');
var readLine = require('readline');
var MAXTWEETS = process.argv[2];
var falsePositives=0;
var falseNegatives=0;
var truePositives=0;
var trueNegatives=0;
var neutrals=0;
var tweetsRead=0;
var numStreamsClosed=0;
var prl = readLine.createInterface({
    input: pstream
});
var nrl = readLine.createInterface({
    input: nstream
});
startTesting(prl, true);
startTesting(nrl, false);
function startTesting(rl, pos){ //pos indicates positives
    rl.on('line', (tweet)=>{
        parse(tweet, pos);
    });
    rl.on('close', ()=>{
        numStreamsClosed++;
        if(numStreamsClosed==2)
            displayTestResults();
    });
}
function parse(tweet, pos){
    tweetObject=JSON.parse(tweet);
    tweetObject['text']?test(tweetObject['text'], pos):process.exit(-1);
    tweetsRead++;
    if(MAXTWEETS&&tweetsRead>=MAXTWEETS)
        displayTestResults();
}

function test(message, pos){
    let res=0;
    if(0<(res=parseFloat(sentiment.evaluateSentence(message))))
        if(pos)truePositives++;
        else falsePositives++;
    else if (res<0)
        if(pos)falseNegatives++;
        else trueNegatives++;
    else //res=0
        neutrals++; // 0 can not indicate positive or negative, so it is always a false result
}
function displayTestResults(){
    prl.close();
    nrl.close();
    let results =  'accuracy:          '+((trueNegatives+truePositives)/tweetsRead*100)+'%\n'
                  +'true positives:    '+(truePositives/tweetsRead*100)+'%\n'
                  +'true negatives:    '+(trueNegatives/tweetsRead*100)+'%\n'                  
                  +'false positives:   '+(falsePositives/tweetsRead*100)+'%\n'
                  +'false negatives:   '+(falseNegatives/tweetsRead*100)+'%\n'
                  +'false neutrals:    '+(neutrals/tweetsRead*100)+'%\n';
                  
    process.stdout.write('Tested against ' + tweetsRead + ' tweets\n');
    process.stdout.write(results);          
    process.exit(0);
}