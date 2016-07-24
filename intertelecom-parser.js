/**
 * Created by root on 23.07.16.
 */
var cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    rp = require('request-promise');

module.exports = (function(res, err){
    
    var requestObject = {
        url: 'http://www.intertelecom.ua/ru/3g-internet#tariffs',
        encoding: null
    };

    rp(requestObject).then(function(body) {
        var bodyWithCorrectEncoding = iconv.decode(body, 'win1251');
        var results = parse(bodyWithCorrectEncoding);
        res(results);
    }).catch(err);

    function parse(str) {
        $ = cheerio.load(str);

        var smartphone = $('[data-plan="smartphone"] .tarifs--item'),
            tablet = $('[data-plan="tablet"] .tarifs--item'),
            notebook = $('[data-plan="notebook"] .tarifs--item');

        var intertelecom_internet_rates = {
            smartphone: getParsedObject(smartphone),
            tablet: getParsedObject(tablet),
            notebook: getParsedObject(notebook)
        };
        return JSON.stringify(intertelecom_internet_rates);
    }

    function getParsedObject(DOMObject){
        var intertelecom_url = 'http://www.intertelecom.ua';

        var name = '.item-caption h4',
            description = '.item-description p';

        var rate_name = ('.item-table ul :nth-child(1) .item-table--title'),
            rate_fee = ('.item-table ul :nth-child(1) .item-table--description .item-table--large'),
            fee_period = ('.item-table ul :nth-child(1) .item-table--description .item-table--small');

        var internet_name = ('.item-table ul :nth-child(2) .item-table--title'),
            internet_traffic = ('.item-table ul :nth-child(2) .item-table--description .item-table--large'),
            internet_period = ('.item-table ul :nth-child(2) .item-table--description .item-table--small');

        var feature_name = ('.item-table ul :nth-child(3) .item-table--title'),
            feature_description = ('.item-table ul :nth-child(3) .item-table--description span');

        var rate_url = ('.more_more');
        var parsed_objects_arr = [];

        var i = 0;
        $(DOMObject).each(function() {
            var o = {
                row: i,
                title: $(name, this).text(),
                description: $(description, this).text(),
                fee: {
                    name: $(rate_name, this).text(),
                    price: $(rate_fee, this).text(),
                    period: $(fee_period, this).text()
                },
                internet: {
                    name: $(internet_name, this).text(),
                    traffic: $(internet_traffic, this).text(),
                    period: $(internet_period, this).text()
                },
                feature: {
                    name: $(feature_name, this).text(),
                    description: $(feature_description, this).text()
                },
                rate_url: intertelecom_url + $(rate_url, this).attr('href')
            };
            i++;
            parsed_objects_arr.push(o);
        });
        return parsed_objects_arr;
    }
})(function(res){console.log(res)}, {});