const request = require('request'),
      cheerio = require('cheerio'),
      readline = require('readline'),
      opn = require('opn'),
      fs = require('fs'),
      crypto = require('crypto');
var   $;

if(process.argv[2] == '-u'){
    request(process.argv[3], function (error, response, html) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(html, { decodeEntities: false });
            startscr();
        }
        else{
            console.log('\x1b[41m%s\x1b[0m', 'Invalid URL to image or image was deleted');
        }
    });
} else {
    // User input - URL
    console.log('');
    console.log('\x1b[31m%s\x1b[0m', '------------------------------------------------------');
    console.log('InstaSave v 0.0.1');
    console.log('\x1b[31m%s\x1b[0m', '------------------------------------------------------');
    console.log('');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('URL to Instagram photo: ', (answer) => {
        request(answer, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                $ = cheerio.load(html, { decodeEntities: false });
                startscr();
            }
            else{
                console.log('\x1b[41m%s\x1b[0m', 'Invalid URL to image or image was deleted');
            }
        });
        rl.close();
    });
}

// Functions

function startscr(){
    console.log('\x1b[32m%s\x1b[0m', 'Url to image: ' + $('meta[property="og:image"]').attr('content'));

    const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if(process.argv[4] != '-a'){
        console.log("*******************************************************");
        rl2.question('Save image (1) OR Open in browser (2): ', (answer2) => {
            console.log("*******************************************************");
            doAction(answer2);
            rl2.close();
        });
    } else {
        doAction(process.argv[5]);
    }
}

function doAction(ans){
    switch (ans) {
        case '1':
            var filename = crypto.createHash('md5').update( $('meta[property="og:image"]').attr('content') ).digest('hex');
            console.log('\x1b[36m%s\x1b[0m', 'Save image as ' + filename + '.png');
            download($('meta[property="og:image"]').attr('content'), filename + '.png', function(){});
            process.exit(-1);
            break;
        case '2':
            console.log('\x1b[36m%s\x1b[0m', 'Open in browser');
            opn($('meta[property="og:image"]').attr('content')).then(() => {
                process.exit(-1);
            });
            break;
        default:
            console.log('\x1b[41m%s\x1b[0m', 'Error');
            break;
    }
}

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};  