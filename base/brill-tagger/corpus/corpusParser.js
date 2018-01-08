const fs = require('fs');
const corpusPath = './data/wsj_';
const corpusDict = {};
var ws = fs.createWriteStream('./corpusDict.json');
generateJSON();
/*
 * Read .dp file of specified index
 */
function read(ind){
    let formattedInd = 
        '0000'.slice(0, -(String(ind)).length) + String(ind);
    let filepath = corpusPath + formattedInd + '.dp';
    let contents;
    try{
        contents = fs.readFileSync(filepath, 'utf8');
    }
    catch(err){
        if(err.code === 'ENOENT')
            return null; /* return null if file does not exist 
                            (this is important for determining 
                            if there are no more files to index) */
        else
            throw new Error(err.code);
    }
    return contents;
}
function generateJSON(){
    let ind = 0;
    let res;
    while(null!==(res=read(++ind))){
        let lines = res.split('\n');
        for(let i = 0, len = lines.length; i < len; i++){
            let items = lines[i].split('\t');
            if(items.length > 2){
                let pos = items[1];
                let num = items[2];
                let word = (pos==="NNP")?(items[0]):(items[0].toLowerCase());
                if(!corpusDict[word])
                    corpusDict[word] = {};
                if(!corpusDict[word][pos])
                    corpusDict[word][pos] = [num];
                else
                    corpusDict[word][pos].push(num);
            }
        }
    }
    ws.write(JSON.stringify(corpusDict, null, '\t') + '\n');
}