exports.wordNetTags = ['v','a','n','r'];
exports.pennTreeBankTags=['CC','CD','DT','EX','FW','IN','JJ','JJR','JJS','LS',
'MD','NN','NNS','NNP','NNPS','PDT','POS','PRP','PRP$',
'RB','RBR','RBS','RP','SYM','TO','UH','VB','VBD','VBG',
'VBN','VBP','VBZ','WDT','WP','WP$','WRB'];
/* Tags that can never be used with wordnet */
exports.pennOnlyTags=['CC','CD','DT','EX','FW','IN','LS','MD','PDT','POS',
'SYM','TO','UH','PRP','PRP$','WDT','WP','WP$','WRB'];
exports.punctuation=['.', ',', '``', "''",':','$','(',')'];

/* The below tags can be converted for use with wordnet */
exports.verbTags=['VB','VBD','VBG','VBN','VBP','VBZ'];
exports.adjTags=['JJ','JJR','JJS'];
exports.nounTags=['NN','NNS','NNP','NNPS'];
exports.adverbTags=['RB','RBR','RBS','RP'];

exports.validPennTag=(tag)=>(exports.pennTreeBankTags.includes(tag)||exports.punctuation.includes(tag));
/* convert tag from penn Treebank format to a verb, adjective, adverb, or noun tag. 
   If it is not one of these return null. */
exports.pennToWordNet = function(tag){
    if(tag.indexOf('V')===0)
        return 'v';
    else if(tag.indexOf('J')===0)
        return 'a';
    else if(tag.indexOf('N')===0)
        return 'n';
    else if(tag.indexOf('R')===0)
        return 'r';
    else
        return null;
}