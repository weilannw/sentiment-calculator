const exceptions = require('./exceptions.json');
const validTags = ['v', 'a', 'n', 'r'];
function predictTag(word){
    let tags = [];
    for(let i = 0, len = validTags.length; i < len; i++){
        res = morph(word, validTags[i]);
        if(!(res.length === 1 && res[0] === word))
            tags.push(validTags[i]);
    }
    return tags;
}
/* returns an array of results (often there is only one result) */
function morph(word, tag){
    let res = '';
    if(!validTags.includes(tag)) return [word];
    if(res=exceptions[tag][word]) return [res];
    switch(tag){
        case 'v':
            return processVerb(word);
            break;
        case 'a':
            return processAdj(word);
            break;
        case 'n':
            return processNoun(word);
            break;
        case 'r':
            return [word];
        default:
            return null;
    }
}
function processVerb(word){
    if(endsWith(word, 'ies') || endsWith(word, 'ied'))
        return [word.slice(0, -3)+'y'];
    else if(endsWith(word, 'tted') || endsWith(word, 'rred') ||
            endsWith(word, 'pped') || endsWith(word, 'mmed') ||
            endsWith(word, 'gged') || endsWith(word, 'nned'))
        return [word.slice(0, -3)];
    else if(endsWith(word, 'dded'))
        return [word.slice(0, -2), word.slice(0, -3)];
    else if(endsWith(word, 'es') || endsWith(word, 'ed'))
        return [word.slice(0, -1), word.slice(0, -2)];
    else if(endsWith(word, 'ss') || endsWith(word, 'is') ||
            endsWith(word, 'us'))
        return [word];
    else if(endsWith(word, 's'))
        return [word.slice(0, -1)];
    else if(endsWith(word, 'tting') || endsWith(word, 'rring') ||
            endsWith(word, 'pping') || endsWith(word, 'mming') ||
            endsWith(word, 'gging') || endsWith(word, 'nning'))
        return [word.slice(0, -4)];
    else if(endsWith(word, 'dding'))
        return [word.slice(0, -3), word.slice(0, -4)];
    else if(endsWith(word, 'ing'))
        return [word.slice(0, -3)+'e', word.slice(0, -3)];
    else
        return [word];
}
function processNoun(word){
    if(endsWith(word, 'ies'))
        return [word.slice(0, -3)+'y', word.slice(0, -1)];
    else if(endsWith(word, 'es'))
        return [word.slice(0, -1), word.slice(0, -2)];
    else if(endsWith(word, 'ss') || endsWith(word, 'is') ||
            endsWith(word, 'us'))
        return [word];
    else if(endsWith(word, 's'))
        return [word.slice(0, -1)];
    else if(endsWith(word, 'men'))
        return [word.slice(0, -3)+'man'];
    else 
        return [word];
}
function processAdj(word){
    if(endsWith(word, 'ier'))
        return [word, word.slice(0, -1), word.slice(0, -2), word.slice(0, -3)+'y'];
    else if(endsWith(word, 'er'))
        return [word, word.slice(0, -1), word.slice(0, -2), word.slice(0, -3)];
    else if(endsWith(word, 'iest'))
        return [word, word.slice(0, -2), word.slice(0, -3), word.slice(0, -4)+'y'];
    else if(endsWith(word, 'est'))
        return [word, word.slice(0, -2), word.slice(0, -3), word.slice(0, -4)];
    else  
        return [word];
}

function endsWith(word, endStr){
    return (
           endStr.length <= word.length &&
           word.slice(-endStr.length, word.length)===endStr
           );
}

exports.morph = morph;
exports.predictTag = predictTag;