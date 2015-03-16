var http = require("http");
var https = require("https");
var assert = require("assert")
var brain = require("brain");
var api = require('./stockdata.js');
var url = require('url');

var net = new brain.NeuralNetwork();
/*
var xor = [{ input: [0, 0], output: [0]},
           { input: [0, 1], output: [1]},
           { input: [1, 0], output: [1]},
           { input: [1, 1], output: [0]}];
var not = [{input: [1], output: [0]},
           {input: [0], output: [1]}];
var sample = [{ input: [1335499200], output: [15.57] },
  { input: [1335412800], output: [15.53] },
  { input: [1335326400], output: [15.5] },
  { input: [1335240000], output: [15.43] },
  { input: [1335153600], output: [15.33] },
  { input: [1334894400], output: [15.6] },
  { input: [1334808000], output: [15.4] }];
var trainStream = net.createTrainStream({
  //Write training data to the stream. Called on each training iteration.
  floodCallback: function() {
    console.log("iteration: "+ iteration);
    iteration++;
    flood(trainStream, data);
  },
  //Called when the network is done training.
  doneTrainingCallback: function(obj) {
    console.log("trained in " + obj.iterations + " iterations with error: "
                + obj.error);
    var result = net.run([1334800000]);
    console.log("0 XOR 1: ", result);  // 0.987
  }
});
// kick it off
//flood(trainStream, sample);
function flood(stream, data) {
  for (var i = 0; i < data.length; i++) {
    stream.write(data[i]);
  }
  // let it know we've reached the end of the data
  stream.write(null);
}*/
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.pipe(process(url.parse(req.url, true).query));
  res.end('Hello World\n');
  /*
  try{
  var lol = process(url.parse(req.url, true).query, function(data){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(data);
    res.end('Hello World\n');
    res.destroy();
    console.log("ENDED");
  });
  }
  catch (err){}
  */
}).listen(8000, 'localhost');

var makeString = function(data){
  var str = '';
  for (var i=data.length-1; i>=0; i--){
    str = str.concat(data[i].output[0]+',');
  }
  return str;
};

var process = function (query, callback){
  var stocks = query.stock.split(",");
  var startStamp = query.startStamp;
  var endStamp = query.endStamp;

  api.download("YHOO", startStamp, endStamp, function (res){
    var data = res;
    //console.log(res);
    //flood(trainStream, data);
    //console.log(data);
    /*
    net.train(data, {
      errorThresh: 0.002,  // error threshold to reach
      iterations: 5000,   // maximum training iterations
      log: false,           // console.log() progress periodically
      logPeriod: 10,       // number of iterations between logging
      learningRate: 0.1    // learning rate
    });*/
    callback(makeString(data));
    //console.log(net.run([1]));
    //console.log(net.run([0.8]));
    //console.log(net.run([0.6]));
    //console.log(net.run([0.4]));
    //console.log(net.run([0.2]));
    //console.log(net.run([0]));
  });
}
