var Patient = require('../models/patient');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/people", { useNewUrlParser: true });
var patients = [
  new Patient({
    firstName: 'Brian',
    lastName:'Sharkey',
    ppsNumber: 12345678,
    Age: 26,
    imgPath: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'
  })
];

var done = 0;

for(var i = 0; i< patients.length;i++)
{
  patients[i].save(function(err,result){
    done++;
    if(done === patients.length){
      exit();

    }
  });
}

function exit()
{
  mongoose.disconnect();
}
