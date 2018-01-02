var s = require('../sentiment');
var stdin = process.stdin;
var stdout = process.stdout;
const PROMPT = "Enter a sentence to be given a positivity rating (Enter '!' to exit)\n";
if(process.argv)
var processSentence = function(sentence){
    var sentence = String(sentence).substring(0, String(sentence).length-1);
    if(sentence === '!')
        process.exit();
    let posScore = s.evaluateSentence(sentence);
    let rating = (posScore >= 0)?((posScore===0)?'neutral':'positive'):'negative';    
    stdout.write('Positivity rating: ' + posScore + '\n'
                + 'The sentence is ' + rating + '.\n');
    stdout.write(PROMPT);
};
stdout.write(PROMPT);
stdin.on('data', processSentence);
