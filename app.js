var assert = require("assert"),
    brain = require("brain/lib/brain.js");
var api = require('./stockdata.js');

var net = new brain.NeuralNetwork();

var xor = [{ input: [0, 0], output: [0]},
           { input: [0, 1], output: [1]},
           { input: [1, 0], output: [1]},
           { input: [1, 1], output: [0]}];

var not = [{input: [1], output: [0]},
           {input: [0], output: [1]}];

var trainStream = net.createTrainStream({
  //Write training data to the stream. Called on each training iteration.

  floodCallback: function() {
    flood(trainStream, xor);
  },

  //Called when the network is done training.
  doneTrainingCallback: function(obj) {
    console.log("trained in " + obj.iterations + " iterations with error: "
                + obj.error);

    var result = net.run([1, 0]);
    console.log("0 XOR 1: ", result);  // 0.987
  }
});

// kick it off
flood(trainStream, xor);


function flood(stream, data) {
  for (var i = 0; i < data.length; i++) {
    stream.write(data[i]);
  }
  // let it know we've reached the end of the data
  stream.write(null);
}

api.download("YHOO", 0,0, function (data){console.log(data)});