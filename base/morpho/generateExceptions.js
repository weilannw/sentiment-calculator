const fs = require('fs');
var ws = fs.createWriteStream('exceptions.json');
var json = {};
run();
function run(){
    readData('irregularverbs.txt', 'v');
    readData('irregularadjectives.txt', 'a');
    readData('irregularnouns.txt', 'n');
    readData('irregularadverbs.txt', 'r', true);
}
function readData(filename, type, output){
    fs.readFile(filename, {encoding:'utf8'}, 
        (err, contents)=>{
            if(err) throw Error;
            parseFile(contents, type, output);}
        );
}
function parseFile(contents, type, output){
    let arr = contents.split(/[\s\n\t\/,]+/);
    let baseWord = '';
    json[type]={};
    for(let i = 0, len = arr.length; i < len; i++){
        if(arr[i]!=='\n' && arr[i]!==''){
            if(arr[i]==='.'){
                baseWord = arr[++i];
                if(baseWord==='.' || baseWord === ''){
                    process.stderr.write("Warning: invalid base word in type " + type + "\n");
                }
            }
            else if(!json[type][arr[i]]){
                json[type][arr[i]] = baseWord;
            }
        }
    }
    if(output) ws.write(JSON.stringify(json, null, '\t'));
}