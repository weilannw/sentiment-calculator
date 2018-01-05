/* find out how many words that are in the brill-tagger corpus are also
   in the wordnet dictionary. This is to test that the corpus is useful.
   
   Some words are ignored because the part of speech is not in wordnet */
const fs = require('fs');
const wordNet = require('../wordnet-dict/SentiWordNet');
const corpus = require('../brill-tagger/corpus/corpusDict');  
const morpho = require('../morpho/morphoUtil');
const tagUtil = require('../morpho/tagUtil');
var totalWords = 0; //this will count all part of speech forms as unique
var totalCompatibleWords = 0; //this will only regard wordnet part of speech forms as unique, and disregards non-wordnet forms
var matches = 0;
var ignored = 0;
var nonMatches = '';
var ws = fs.createWriteStream('non-matches.txt');
compareAll();
printOutput();
function compareAll(){
    let words = Object.keys(corpus);
    for(let i = 0, len = words.length; i < len; i++){
        let posKeys = Object.keys(corpus[words[i]]);
        totalWords += posKeys.length;
        let wordNetPos = []; //stores the wordnet part of speeches of a word for calculating total # compatible words
        for(let ii = 0, len = posKeys.length; ii < len ; ii++){
            let wordNetTag;
            if(null!==(wordNetTag = tagUtil.pennToWordNet(posKeys[ii]))){
                if(!wordNetPos.includes(wordNetTag)){
                    wordNetPos.push(wordNetTag);
                    totalCompatibleWords++;
                    if(posKeys[ii]==='NNP') //ignore singular proper nouns
                        ignored++;
                    else if(wordExistsInWordNet(words[i], posKeys[ii]))
                        matches++;
                    else
                        nonMatches+=words[i]+ ' ' + wordNetTag + '\n';
                }
            }
        }
    }
}
function printOutput(){
    let remaining;
    process.stdout.write(
        'total unique words in corpus:             ' + totalWords + '\n' +
        'total unique wordnet-compatible words:    ' + totalCompatibleWords + '\n\n' +
        'matches:                                  ' + matches + '\n' +
        'matches % of total (compatible):          ' + (matches / totalCompatibleWords * 100) + '%\n\n' +
        'ignored:                                  ' + ignored + '\n' +
        'ignored % of total (compatible):          ' + (ignored / totalCompatibleWords * 100) + '%\n\n' +
        'remaining:                                ' + (remaining = totalCompatibleWords-matches-ignored) + '\n' +
        'remaining % of total (compatible):        ' + (remaining / totalCompatibleWords * 100) + '%\n\n' 
    );
    ws.write(nonMatches);
}
function wordExistsInWordNet(word, pos){
    let tag = tagUtil.pennToWordNet(pos);
    if(!corpus[word]) return false;
    let morph = morpho.morph(word, tag);
    for(let i = 0, len = morph.length; i < len; i++){
        if(wordNet[morph[i]] && wordNet[morph[i]][tag]){
            return true;
        }
    }
    return false;
}

