var http = require("http");
var https = require("https");
var assert = require("assert")
var brain = require("brain");
var api = require('./stockdata.js');
var url = require('url');

var net = new brain.NeuralNetwork();


  api.download("YHOO", 0, 0, function (res){
    var data = res;
    //console.log(res);
    //flood(trainStream, data);
    //console.log(data);

    net.train(data, {
      errorThresh: 0.001,  // error threshold to reach
      iterations: 5000,   // maximum training iterations
      log: true,           // console.log() progress periodically
      logPeriod: 10,       // number of iterations between logging
      learningRate: 0.3    // learning rate
    });
    //callback(makeString(data));
    console.log(net.run([1.2]));
    console.log(net.run([1]));
    console.log(net.run([0.8]));
    console.log(net.run([0.6]));
    console.log(net.run([0.4]));
    console.log(net.run([0.2]));
    console.log(net.run([0]));
  });
