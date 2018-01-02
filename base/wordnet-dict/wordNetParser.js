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
const READFILE = 'SentiWordNet_3.0.0_20130122.txt';
const WRITEFILE = 'sentiWordNet.json';
const STARTLINEIND = 885;
const CHARINTERVAL = 500;
var data = '';
var wordNetDict = {};
var rs = fs.createReadStream(READFILE, {start: STARTLINEIND});
var ws = fs.createWriteStream(WRITEFILE);

function onReadable(){
    let res;
    while(null!==(res = rs.read(CHARINTERVAL))){ 
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
function run(){
    rs.on("readable", onReadable);
    rs.on("end", ()=>{
        ws.write(JSON.stringify(wordNetDict, null, '\t'));
    });
}
run();
