var http = require('http');
var fs = require('fs');
var qs = require('qs'); //querystring
var ms = require('memorystream');
var csv = require('csv');

var memStream = new ms(null, {
  readable : false
});
/*
http://ichart.finance.yahoo.com/table.csv?s=YHOO&d=0&e=28&f=2010&g=d&a=3&b=12&c=1996&ignore=.csv
sn = TICKER
a = fromMonth-1
b = fromDay (two digits)
c = fromYear
d = toMonth-1
e = toDay (two digits)
f = toYear
g = d for day, m for month, y for yearly
*/

function getDate(stamp){
  var a = new Date(stamp * 1000);
  var date = a.getDate();
  return date;
}

function getMonth(stamp){
  var a = new Date(stamp * 1000);
  var month = a.getMonth();
  return month+1;
}

function getYear(stamp){
  var a = new Date(stamp * 1000);
  var year = a.getFullYear();
  return year;
}

function getStamp(year, month, day){
  return (new Date(year + "/" + month + "/" + day).getTime() / 1000);
}
var data;
module.exports.data = data;
module.exports.download = function(symbol, startStamp, endStamp, callback) {
  var param = {s:symbol,
               a:getMonth(startStamp),
               b:getDate(startStamp),
               c:getYear(startStamp),
               d:getMonth(endStamp),
               e:getDate(endStamp),
               f:getYear(endStamp),
               g:"d",
               ignore:".csv"};
  //var file = fs.createWriteStream("file.csv");
  var request = http.get("http://ichart.finance.yahoo.com/table.csv?"+qs.stringify(param), function(response) {
    /*
    response.pipe(file);
    response.on('end', function() {
      fs.readFile('./file.csv', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
      });
    });
    */
    response.pipe(memStream);
    response.on('end', function() {
      data = memStream.toString();
      csv.parse(data, function(err, data){
        data.splice(0, 1);
        for (var i=0; i<data.length; i++){
          var temp = data[i][0].split("-");
          data[i] = {input:[parseInt(getStamp(temp[0], temp[1], temp[2]))/1000000000], output:[parseFloat(data[i][6])/100]};
        }
        callback(data);
      });
    });
  });
}

