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
var readline = require('readline');
const READFILE = 'SentiWordNet_3.0.0_20130122.txt';
const WRITEFILE = 'sentiWordNet.json';
const STARTLINEIND = 885;
const STARTIND = 11; //index of start of relevant data on each line
const CHARINTERVAL = 500;
var data = '';
var wordNetDict = {};
var rs = fs.createReadStream(READFILE, {start: STARTLINEIND});
var ws = fs.createWriteStream(WRITEFILE);
var stdout = process.stdout;

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
        let data = str.slice(STARTIND).split('\t');
        if(data.length >= 3){
            addWordsToDict(data[0], data[1], data[2].split(' '));
        }
    }
 }
 function addWordsToDict(neg, pos, words){
    let obj = {n: neg, p: pos};
    for(let i = 0, len = words.length; i < len; i++)
        addWordToDict(obj, words[i].split('#'));
 }
 function addWordToDict(obj, wordData){
    let word = wordData[0];
    let ind = wordData[1]-1; //make it more like array indexing
    if(!wordNetDict[word])
        wordNetDict[word]={};
    if(!wordNetDict[word][ind])
        wordNetDict[word][ind]=obj;         
    else if(wordNetDict[word][ind].constructor!==Array){
        let firstObj = wordNetDict[word][ind];
        wordNetDict[word][ind]=[firstObj, obj];
    }
    else
        wordNetDict[word][ind].push(obj);
 }
function run(){
    rs.on("readable", onReadable);
    rs.on("end", ()=>{
        ws.write(JSON.stringify(wordNetDict, null, '\t'));
    });
}
run();
