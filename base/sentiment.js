/* Author: https://github.com/weilannw
 * This code relies on a json file generated from
 * SentiWordNet_3.0.0_20130122.txt which was
 * retrieved from the following source:
 * 
 *     Princeton University "About WordNet." 
 *     WordNet. Princeton University. 
 *     2010. <http://wordnet.princeton.edu>
 */
const wordNet = require('./wordnet-dict/sentiWordNet.json');
const tagUtil = require('./morpho/tagUtil.js');
const morpho = require('./morpho/morphoUtil.js');
/* removes characters and whitespace from a sentence, gets posScore*/
function errMsg(){
    process.stderr.write("sentence undefined\n");
    process.exit(-1);
}
function evaluateSentence(sentence){
    sentence = sentence?String(sentence):errMsg();
    var s = sentence.toLowerCase();
    let words = s.split(/[ ,\/#!$%\^&\*;:{}=\-_`~().]+/g)
                .filter(function(str){
                    return str != '';
                });
    return getPosScore(words);
}
/* take avg of avgs of positivity ratings (excluding 0s) of all words in a sentence */
function getPosScore(words){
    let sum = 0
    let len=words.length;
    let numNonZeroRatings=0;
    for(let i = 0; i < len; i++){
        let rating=getPositivityRatingAvg(words[i]);
        sum+=rating;
        if(rating!=0)
            numNonZeroRatings++;        
    }
    return numNonZeroRatings?sum/numNonZeroRatings:0;
}
/* tries to find a match in wordnet by modifying the word.
   returns null on failure */
function findMatch(word){
    let trans;
    let res;
    let tags = tagUtil.wordNetTags;
    if(res = wordNet[word])
        return res;
    for(let i = 0, len = tags.length; i < len; i++){
        trans = morpho.morph(word, tags[i]);
        for(let ii = 0, len = trans.length; ii < len; ii++){
            if((res = wordNet[trans[ii]])&&
                wordNet[trans[ii][tags[i]]]){
                process.stdout.write("Res: " + trans[ii] + "\n");
                return res;
            }
        }
    }
    return null;
}

/*Takes average of pos and neg scores for all definitions of a single word.
This will be between 1 (completely positive) and -1 (completely negative).
This algorithm is just a starting point.*/
function getPositivityRatingAvg(word){
    let dictEntry = findMatch(word);
    if(!dictEntry) return 0;
    let posKeys = Object.keys(dictEntry); //part of speech keys
    let sum=0;
    let len=posKeys.length;
    for(let i = 0; i < len; i++){
        let posObj=dictEntry[posKeys[i]];
        sum+=weightedAvgWordScore(posObj);
    }
    return sum/len;
}
function weightedAvgWordScore(defArray){
    let weightedScores = 0.0;
    let weightSum = 0.0;
    for(let i = 0, len = defArray.length; i < len; i++){
        weightedScores+=(parseFloat(defArray[i].p)-parseFloat(defArray[i].n))/(i+2);
        weightSum+=1.0/(i+2); //sum of the weights applied to each score
    }
    return weightedScores/weightSum;
}

exports.evaluateSentence = evaluateSentence;
