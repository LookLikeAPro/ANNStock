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

var data = {};

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
}

api.download("YHOO", 0,0, function (res){
  data = res;
  //console.log(res);
  flood(trainStream, data);
});
