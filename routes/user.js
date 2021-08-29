
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Patient = require('../models/patient');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
mongoose.connect("mongodb://localhost:27017/people", { useNewUrlParser: true });

var csrfProtection = csrf();
router.use(csrfProtection);


router.post('/profile/:id', isLoggedIn, function(req,res,next){
  console.log(req.params.id);
  var patient_id = req.params.id;
  var first, last, pps,age,spo2,bpm, email;
  Patient.findById(patient_id, function(err, patient) {
    if(err){
      return res.redirect('/')
    }
    first = patient.firstName;
    last = patient.lastName;
    pps = patient.ppsNumber;
    age = patient.Age;
    spo2 = patient.spo2;
    bpm = patient.bpm;
    email = patient.email;

    const output = `
    <p>Hello,</p>
    <br>
    <p>The Covid Digital doctor system has detected that your
    oxygen saturation levels are low. It is advised you return to hospital.</p>
    <br>
    <p>Thank you,</p>
    <br>
    <p>The Covid Digital Doctor Team.</p>
    `;

    let transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: 'CovidDigitalDoctor@gmail.com', // generated ethereal user
        pass: 'GMIT2020/2021'  // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Covid Digital Doctor" <CovidDigitalDoctor@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Oxygen saturation is low!', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      //  res.redirect('/covidapp/index',{msg: 'Email sent!'});

    });

  });


});







router.get('/profile/:id', isLoggedIn, function(req,res,next){


  var patient_id = req.params.id;
  var first, last, age, pps;
  Patient.findById(patient_id, function(err, patient) {
    if(err){
      return res.redirect('/')
    }
    var first = patient.firstName;
    var last = patient.lastName;
    var pps = patient.ppsNumber;
    var age = patient.Age;
    var spo2 = patient.spo2;
    var bpm = patient.bpm;
    var numberofReadingsBPM = [bpm];
    var numberofReadingsSPO2 = [spo2];
    numberofReadingsBPM.push(" ");
    numberofReadingsSPO2.push(" ");
    res.render('user/profile', {csrfToken: req.csrfToken(), first: first, last: last, pps:pps, age:age,
      spo2:spo2, bpm: bpm, id:patient_id, numberofReadingsSPO2: numberofReadingsSPO2, numberofReadingsBPM: numberofReadingsBPM});
    })


  });



  router.get('/newpatient', isLoggedIn, function(req,res,next){
    res.render('user/newpatient',{csrfToken: req.csrfToken()});
  });

  router.post('/newpatient', isLoggedIn, function(req,res,next){
    var patient = new Patient({
      firstName: req.body.first,
      lastName:req.body.last,
      email: req.body.email,
      ppsNumber: req.body.pps,
      Age: req.body.age,
      imgPath: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'
    });

    patient.save(function(err,result){
      exit();
    });


    function exit()
    {

    }
    res.redirect('/covidapp/index');
  });

  router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/');
  });
  router.use('/', notLoggedIn, function(req, res, next){
    next();
  });

  router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });

  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));

  router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });

  router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/covidapp/index',
    failureRedirect: '/user/signin',
    failureFlash: true
  }));


module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
