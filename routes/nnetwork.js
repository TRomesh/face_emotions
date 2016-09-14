var express = require('express');
var app = require('express')();
var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
var synaptic = require('synaptic');
var divby = 250;
var filename = "./data/test.json";
var fs = require('fs');
//DEBUG=myapp:* npm start

//this file contrains the code for working with the neural network

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

trainingopts = {
        rate: .01,
        iterations: 50,
        error: .001,
        shuffle: true,
        log: 1,
        cost: Trainer.cost.MSE
    }

    //this works! no resetting!
var myNetwork = new Architect.Perceptron(112, 80,7);



//trainer does propagate much better then you.

var trainer = new Trainer(myNetwork);
router.post('/newnn', function(req, res, next) {
  myNetwork.reset();
  res.send(["newnn"]);
});
router.post('/test', function(req, res, next) {
  var array = JSON.parse(req.body.posarray);
  var traindata = makeinput(req.body.emotion,array);
  res.send(mytrainer.test([traindata]));
});


router.post('/activate', function(req, res, next) {
  var array = JSON.parse(req.body.posarray);
  array = [].concat.apply([], array);
  var cleanarr = [];
  array.forEach(function(currentValue,index){
    cleanarr.push(currentValue/divby);
  });
  //console.log(array);
  var netoutput = myNetwork.activate(cleanarr);
  res.send(netoutput);
});

router.post('/filetrain', function(req, res, next) {
  var lineReader = require('readline').createInterface({
    input: fs.createReadStream(filename)
  });
  var array = [];
  lineReader.on('line', function (line) {
    array.push(JSON.parse(line));
  });
  lineReader.on('close', () => {
    trainer.train(array,trainingopts);
  });
  
  res.send('loaded!');
});


router.post('/train', function(req, res, next) {

  var array = JSON.parse(req.body.posarray);
  var traindata = makeinput(req.body.emotion,array);
  res.send(trainer.train([traindata],trainingopts));

});

function makeinput(emotion,array){
  var arrpack = [];
  array.forEach(function(currentValue,index){
    arrpack.push(currentValue[0]/divby);
    arrpack.push(currentValue[1]/divby);
  });
  emopack = [0,0,0,0,0,0,0];
  //emopack = [emotion];
  emopack[emotion] = 1;
  pack = {};
  pack.input = arrpack;
  pack.output = emopack;
  return pack;
  //trainingSet = [{input: [0,0],output: [0]}]
}


module.exports = router;
