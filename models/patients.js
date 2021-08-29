module.exports = function Patients(oldList){
  this.people = oldList.people || {};
  this.totalQty = oldList.totalQty || 0;

  this.add = function(person, id){
    var storedPerson = this.people[id];
    if(!storedPerson){
      storedPerson = this.people[id] = {person: person, qty: 0};
    }
    storedPerson.qty++;
    this.totalQty++;
  }

  this.generateArray = function() {
    var arr = [];
    for(var id in this.people){
      arr.push(this.people[id]);
    }
    return arr;
  }
};
