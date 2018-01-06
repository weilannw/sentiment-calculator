/* Author: https://github.com/weilannw
 * 
 * This code generates a JSON file using
 * SentiWordNet_<version#>.txt which was
 * retrieved from the following source:
 *       
 *     Princeton University "About WordNet." 
 *     WordNet. Princeton University. 
 *     2010. <http://wordnet.princeton.edu>
 */
var fs = require('fs');
const readfile = 'SentiWordNet_3.0.0_20130122.txt';
const writefile = 'sentiWordNet.json';
const startlineind = 885;
const charInterval = 500;
var data = '';
var wordNetDict = {};
var rs = fs.createReadStream(readfile, {start: startlineind});
var ws = fs.createWriteStream(writefile);

function onReadable(){
    let res;
    while(null!==(res = rs.read(charInterval))){ 
        data+=String(res);
        if(data.indexOf('\n')!==-1)
           handleData(data);
    } 
 }
function handleData(chunk){
    let writeVal = '';
    let before = '';
    if(-1 !== (lineEnd = chunk.indexOf('\n'))){
        before = chunk.slice(0, lineEnd+1);
        //chars before and including new-line char 
        parseLine(before);
        handleData(chunk.slice(lineEnd+1, chunk.length)); 
                   //chars after end of line
    }
    else
         data = chunk;
}
function parseLine(str){    
    if(str){
        let data = str.split('\t');
        if(data.length >= 5 && data[0]!=='')
            addWordsToDict(data[0], data[2], data[3], data[4].split(' '));
    }
 }
 function addWordsToDict(type, pos, neg, words){
    let scores = {p: pos, n: neg};
    for(let i = 0, len = words.length; i < len; i++)
        addWordToDict(type, scores, words[i].split('#'));
 }
 function addWordToDict(type, scoresObj, wordData){
    let word = wordData[0];
    let ind = wordData[1];
    if(!wordNetDict[word])
        wordNetDict[word]={};
    if(!wordNetDict[word][type])
        wordNetDict[word][type]={};
    wordNetDict[word][type][ind]=scoresObj;         
 }
 function convertLookupsToArrayIndices(dict){
    let wordKeys = Object.keys(dict);
    for(let i = 0, len = wordKeys.length; i < len; i++){
        let posKeys = Object.keys(dict[wordKeys[i]]);
        for(let ii = 0, len = posKeys.length; ii < len; ii++){
            let defKeys = Object.keys(dict[wordKeys[i]][posKeys[ii]]);
            let defArray = [];
            for(let iii = 0, len = defKeys.length; iii < len; iii++){
                defArray.push(dict[wordKeys[i]][posKeys[ii]][defKeys[iii]]);
            }
            dict[wordKeys[i]][posKeys[ii]] = defArray;
        }
    }
 }
function run(){
    rs.on("readable", onReadable);
    rs.on("end", ()=>{
        convertLookupsToArrayIndices(wordNetDict);
        ws.write(JSON.stringify(wordNetDict, null, '\t'));
    });
}
run();
