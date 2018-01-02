function morph(word, tag){
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
            return word;
        default:
            return null;
    }
}
function processVerb(word){
    if(endsWith(word, 'ies'))
        return [word.slice(0, -3)+'y'];
    else if(endsWith(word, 'es'))
        return [word.slice(0, -1), word.slice(0, -2)];
    else if(endsWith(word, 'ed'))
        return [word.slice(0, -1), word.slice(0, -2)];
    else if(endsWith(word, 's'))
        return [word.slice(0, -1)];
    else if(endswith(word, 'ing'))
        return [word.slice(0, -3)+'e', word.slice(0, -3)];
    else
        return word;
}
function processNoun(word){
    if(endsWith(word, 'ies'))
        return [word.slice(0, -3)+'y'];
    else if(endsWith(word, 'es'))
        return [word.slice(0, -2)];
    else if(endsWith(word, 's'))
        return [word.slice(0, -1)];
    else if(endswith(word, 'men'))
        return [word.slice(0, -3)+'man'];
    else 
        return word;
}
function processAdj(word){
    if(endsWith(word, 'er'))
        return [word.slice(0, -1), word.slice(0, -2)];
    else if(endsWith(word, 'est'))
        return [word.slice(0, -2), word.slice(0, -3)];
}

exports.morph = morph;

/*case 'c':
            return processOther(word);*/
/*function processOther(word){
    if(word.contains("'")&&word.substring(word.length-2, word.length)){
        process
    }
}*/