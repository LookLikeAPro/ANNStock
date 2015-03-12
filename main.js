var assert = require("assert"),
    brain = require("brain/lib/brain.js");


var blpapi = require("blpapi");

//var session = new blpapi.Session({serverHost: hp.serverHost, serverPort: hp.serverPort});
var session = new blpapi.Session({host: '127.0.0.1', port: 8194});

var service_mktdata = 1; // Unique identifier for mktdata service

var seclist = ['AAPL US Equity', 'VOD LN Equity'];

session.on('SessionStarted', function(m) {
    console.log(m);
    console.log("lol");
    session.openService('//blp/mktdata', service_mktdata);
});

session.on('ServiceOpened', function(m) {
    c.log(m);
    // Check to ensure the opened service is the mktdata service
    if (m.correlations[0].value == service_mktdata) {
        // Subscribe to market bars for each security
        session.subscribe([
            { security: seclist[0], correlation: 100,
              fields: ['LAST_PRICE', 'BID', 'ASK'] },
            { security: seclist[1], correlation: 101,
              fields: ['LAST_PRICE', 'BID', 'ASK'] }
        ]);
    }
});

session.on('MarketDataEvents', function(m) {
    c.log(m);
    // At this point, m.correlations[0].value will equal:
    // 100 -> MarketBarStart for AAPL US Equity
    // 101 -> MarketBarStart for VOD LN Equity
});

session.start();




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
