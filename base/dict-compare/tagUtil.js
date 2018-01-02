exports.PENNTREEBANKTAGS=['CC','CD','DT','EX','FW','IN','JJ','JJR','JJS','LS',
'MD','NN','NNS','NNP','NNPS','PDT','POS','PRP','PRP$',
'RB','RBR','RBS','RP','SYM','TO','UH','VB','VBD','VBG',
'VBN','VBP','VBZ','WDT','WP','WP$','WRB'];
exports.VERBTAGS=['VB','VBD','VBG','VBN','VBP','VBZ'];
exports.ADJTAGS=['JJ','JJR','JJS'];
exports.NOUNTAGS=['NN','NNS','NNP','NNPS'];
exports.ADVERBTAGS=['RB','RBR','RBS','RP'];
exports.validPennTag=(tag)=>PENNTREEBANKTAGS.includes(tag);
/* convert tag from penn Treebank format to a verb, adjective, adverb, or noun tag. 
   If it is not one of these return null. */
exports.convertTag = function(tag){
    if(tag.indexOf('V')===0)
        return 'v';
    else if(tag.indexOf('A')===0)
        return 'a';
    else if(tag.indexOf('N')===0)
        return 'n';
    else if(tag.indexOf('R')===0)
        return 'r';
    else
        return null;
}