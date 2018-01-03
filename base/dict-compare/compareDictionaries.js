/* find out how many words that are in the brill-tagger corpus are also
   in the wordnet dictionary. This is to test that the corpus is useful.
   
   Some words are ignored because the part of speech is not in wordnet */
const fs = require('fs');
const wordNet = require('../wordnet-dict/SentiWordNet');
const corpus = require('../brill-tagger/corpus/corpusDict');  
const morpho = require('../morpho/morphoUtil');
const tagUtil = require('../morpho/tagUtil');
var totalWords = 0;
var matches = 0;
var ignored = 0;
var nonMatches = '';
var ws = fs.createWriteStream('non-matches.txt');
compareAll();
printOutput();
function ignore(tag){
    return (
       !tagUtil.validPennTag(tag) ||
       tag === 'NNP' ||
       tagUtil.PUNCTUATION.includes(tag) || 
       tagUtil.PENNONLYTAGS.includes(tag)
    );
}
function compareAll(){
    let words = Object.keys(corpus);
    for(let i = 0, len = words.length; i < len; i++){
        let posKeys = Object.keys(corpus[words[i]]);
        totalWords += posKeys.length;
        for(let ii = 0, len = posKeys.length; ii < len ; ii++){
            if(ignore(posKeys[ii]))
                ignored++;
            else if(wordExistsInWordNet(words[i], posKeys[ii]))
                matches++;
            else
                nonMatches+=words[i]+ ' ' + posKeys[ii] + ',\n';
        }
    }
}
function printOutput(){
    process.stdout.write(
        'total words in corpus:       ' + totalWords + '\n' +
        'matches:                     ' + matches + '\n' +
        'matches % of total:          ' + (matches / totalWords * 100) + '%\n' +
        'ignored:                     ' + ignored + '\n' +
        'ignored % of total:          ' + (ignored / totalWords * 100) + '%\n'
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

