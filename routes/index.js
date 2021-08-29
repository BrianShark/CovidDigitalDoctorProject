/*
Author: Brian Sharkey - g00301661
used code from https://github.com/mschwarzmueller/nodejs-shopping-cart-tutorial
*/


var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Patients = require('../models/patients');
var fetch = require("node-fetch");
var Regex = require("regex");
var awsIot = require('aws-iot-device-sdk');
var Patient = require('../models/patient');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/people", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

async function getData(topic){
  device.on('connect', function() {
    console.log('connect');
    device.subscribe(topic);
  });
}

async function updateBPMandSPO2(BPM, SPO2){ //Updates the bpm and spo2 arrays
  await Patient.findOneAndUpdate({
    email:'briansharkey07@gmail.com'
  }, {
    $push: {
      bpm: BPM,
      spo2: SPO2,
    }
  });
}


var device = awsIot.device({
  keyPath: "C:\\newAWSkeys\\ac04a7f5c78064d94dab1164b35b32e0dad5d5d4b915a318aea98caa6893c899-private.pem.key",
  certPath: "C:\\newAWSkeys\\ac04a7f5c78064d94dab1164b35b32e0dad5d5d4b915a318aea98caa6893c899-certificate.pem.crt",
  caPath: "C:\\newAWSkeys\\AmazonRootCA1.pem",
  clientId: "node",
  host: "a31tdkejw9fn0n-ats.iot.us-east-1.amazonaws.com"

  /*keyPath: "/home/ubuntu/DigitalDoctor/awsPaths/687b1598d9e74603dbcfab758cfd29c90632a791de25ccb8864d911faf1e1513-private.pem.key",
  certPath: "/home/ubuntu/DigitalDoctor/awsPaths/687b1598d9e74603dbcfab758cfd29c90632a791de25ccb8864d911faf1e1513-certificate.pem.crt",
  caPath: "/home/ubuntu/DigitalDoctor/awsPaths/AmazonRootCA1.pem",
  clientId: "My_ESP32",
  host: "a31tdkejw9fn0n-ats.iot.us-east-1.amazonaws.com"*/

});



getData('esp32/pub');


device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
  var BPM = payload.toString().substring(
    payload.toString().lastIndexOf('"BPM:":') + 7,
    payload.toString().lastIndexOf(',"S') ,
  );

  var SPO2 = payload.toString().substring(
    payload.toString().lastIndexOf('"SPo2:":') + 8, //parsing data from aws
    payload.toString().lastIndexOf(",")
  );
  console.log(BPM);
  console.log('/');
  console.log(SPO2);
  console.log('/');
  updateBPMandSPO2(BPM, SPO2);

});


router.get('/', function(req, res, next) {

  res.render('user/home', { title: 'Covid Digital Doctor' });
});





router.get('/covidapp/index', function(req, res, next) {
  Patient.find(function(err,docs){
    var patientChunks = [];
    chunkSize = 3;
    var totalPatients = docs.length;
    for(var i = 0; i < docs.length; i+= chunkSize ){
      patientChunks.push(docs.slice(i,i+chunkSize));
    }
    res.render('covidapp/index', { title: 'Covid Digital Doctor', patients: patientChunks, totalPatients: totalPatients });
  }).lean();

});


router.get('/covidapp/index', function(req, res, next){
  res.render('covidapp/index',{csrfToken: req.csrfToken()});
});

router.get('/covidapp/info', function(req, res, next){
  res.render('covidapp/info');
});

router.get('/add-to-patients/:id', function(req, res, next) {
  var patientID = req.params.id;
  var patients = new Patients(req.session.patients ? req.session.patients :{});
  console.log("TEST: ");
  Patient.find(function(err,docs){
    console.log(docs.length);
  }
).lean();

Patient.findById(patientID, function(err, patient){
  if(err){
    return res.redirect('/');
  }
  patients.add(patient, patient.id);
  req.session.patients = patients;
  console.log(req.session.patients);
  res.redirect('/');
});

});



module.exports = router;
