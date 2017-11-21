/* This code relies on a json file generated from
 * SentiWordNet_3.0.0_20130122.txt which was
 * retrieved from the following source:
 * 
 *     Princeton University "About WordNet." 
 *     WordNet. Princeton University. 
 *     2010. <http://wordnet.princeton.edu>
 */
var wordNet = require('./sentiWordNet.json');
exports.charLimit = null;
/*removes characters and whitespace from a sentence*/
function evaluateSentence(sentence){
    var s = sentence;
    let words = s.split(/[ ,\/#!$%\^&\*;:{}=\-_`~()]+/g)
                .filter(function(str){
                    return str != '';
                });
    if(words.length === 0){
        return -2;
    }
    return getPosScore(words);
}
/* take avg of avgs of positivity ratings of all words in sentence */
function getPosScore(words){
    let sum = 0
    let len=words.length;
    for(let i = 0; i < len; i++)
        sum+=getPositivityRatingAvg(words[i]);
    return sum/len
}
/*Takes average of pos and neg scores for all definitions of a single word.
This will be between 1 (completely positive) and -1 (completely negative).
Ignores duplicate words (words with the same # value).
This algorithm is just a starting point.*/
function getPositivityRatingAvg(word){
    let dictEntry = wordNet[word];
    if(!dictEntry) return 0;
    let keys = Object.keys(dictEntry);
    let sum=0;
    let len=keys.length;
    for(let i = 0; i < len; i++){
       sum+=parseFloat(dictEntry[keys[i]][0].p) - parseFloat(dictEntry[keys[i]][0].n);
    }
    return sum/len;
}
/*cuts string if it exceeds max chars*/
function limitChars(s, lim){
    s = s.trim();
    for(let i = 0, len = s.length; i < len; i++){
        if(i == lim - 1){
            let c = s.charAt(i);
            if(c===' '){
                s = s.substring(0, i);
                return s;
            }
            else if(s.charAt(i + 1) != ' ')
            {
                return s.substring(0, findIndexOfLastWord(s, i)+1);
            }
        }
    }
}
/*finds the index of the last word to cut the string at
(avoids leaving behind parts of a word)*/
function findIndexOfLastWord(s, curInd){
    var index = 0;
    for(index = curInd; (s.charAt(index) != ' ' && index > 0); index--);
    return index;
}
exports.evaluateSentence = evaluateSentence;
