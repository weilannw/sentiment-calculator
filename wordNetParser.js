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
const STARTIND = 11; //index of start of relevant data on each line
const CHARINTERVAL = 500;
var data = '';
var rs = fs.createReadStream(READFILE, {start: STARTLINEIND});
var ws = fs.createWriteStream(WRITEFILE);
var stdout = process.stdout;
 // order: POS, ID, posScore, negScore, synsetTerms Gloss
function parseLine(str){
    if(str){
        let data = str.slice(STARTIND).split('\t');
        return (data.length >= 3)?toJSON(data[0], data[1], data[2]):'';
    }
    else
        return '';
 }
 function toJSON(pos, neg, wordsStr){
    let words = wordsStr.split(' ');
    let jsonData = '';
    for(let i = 0, len = words.length; i < len; i++){
        jsonData += formatData(pos, neg, words[i]);
    }
    return jsonData;
 }
 function formatData(pos, neg, word){
     // for the first line, do not write a comma on previous line
    formatData = (pos, neg, word)=>{
        return ',\n\t"' + word + '":' + '{"p":"' + pos + '"' +
               ',"n":"' + neg + '"}';
    };
    return '\t"' + word + '":' + '{"p":"' + pos + '"' +
           ',"n":"' + neg + '"}';;
 } 
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
        ws.write(parseLine(before));
        handleData(chunk.slice(lineEnd+1, chunk.length)); 
                   //chars after end of line
    }
    else
        data = chunk;
}
function run(){

    ws.write('{\n');
    rs.on("readable", onReadable);
    rs.on("end", ()=>{
        ws.write('\n}');
    });
}
run();