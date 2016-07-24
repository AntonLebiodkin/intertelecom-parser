/**
 * Created by root on 23.07.16.
 */
var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    url = 'http://www.intertelecom.ua/ru/3g-internet#tariffs';

request(url, function(err, res, body){
    if (!err){
        var $ = cheerio.load(iconv.encode(
            iconv.decode(
                new Buffer(body,'binary'),
                'win1251'),
            'utf8')),
            smartphone = $('[data-plan="smartphone"] .tarifs--item .item-caption h4').filter(function(){
                var data = $(this).text();
                console.log(data);
            }),
            tablet = $('[data-plan="tablet"] .tarifs--item-box'),
            notebook = $('[data-plan="notebook"] .tarifs--item-box');
        //console.log(unescape(encodeURIComponent(smartphone.html())));
    } else {
        console.log("ERROR!");
    }
});